import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import i18n from '@/i18n';

import dayjs from "dayjs";

import {Button, Card, Grid, Loading, Segmented} from "antd-mobile";
import {UndoOutline} from "antd-mobile-icons";
import type {DashboardScale, DashboardTimers} from "@/types/group.ts";

import * as echarts from 'echarts/core';
import {BarChart, LineChart, PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, LegendComponent} from 'echarts/components';
import type {ECharts} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";
import {getDashboardScaleGroup} from "@/utils/request/group.ts";
import {getCssVar} from "@/utils/public.ts";
import DatePicker from "@/component/Date/datePicker.tsx"

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  PieChart
]);

function pluckFields<T extends Record<string, any>>(arr: T[], fields: string[]) {
  const result: Record<string, any[]> = {}

  fields.forEach(field => {
    result[field] = arr.map(item => {
      const keys = field.split('.')
      let value: T = item
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    })
  })

  return result
}
const primaryColor = getCssVar('--active-color')

const getBaseOption = (
  title: string,
  xData: string[],
  barData: number[][],
  lineData: number[],
  barColor: {offset:number ,color:string}[],
  lineColor: string,
  type:'default'|'branch'='default'
) => {
  const titleTips = [
    i18n.t('home.realTimeQuery'),i18n.t('home.cacheTimeQuery'),i18n.t('home.totalQuery'),i18n.t('home.totalBookings')
  ]

  const series = barData.map((bd,bdIndex) => ({
    name: titleTips[bdIndex],
    type: 'bar',
    yAxisIndex: 0,
    data: bd,
    barMaxWidth: 40,
    itemStyle: {
      color: barColor[bdIndex].color
    }
  }))
  return {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: { type: 'shadow' },
      formatter: (params:any) => {
        let str = `${params[0].axisValue}<br/>`
        params.forEach((p:any) => {
          str += `${p.seriesName}: ${p.data.toLocaleString()}<br/>`
        })
        if(type === 'branch'){
          const data1 = params[0].data
          const data2 = params[1].data
          const ratio = data2 === 0 ? (data1 === 0 ? '0:1' : '∞:1') : (data1 / data2).toFixed(0)
          str += `${i18n.t('home.detectionRatio')}: (${ratio}: 1)`
        }
        return str
      }
    },
    legend: {
      top: 50,
      textStyle: { color: '#555' },
      itemGap: 30,
      data: titleTips
    },
    grid: { left: 20, right: 20, bottom: 60, top: 80, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: { alignWithLabel: true },
      axisLabel:{
        rich: {
          left: {
            align: 'right'
          },
          right: {
            align: 'left'
          }
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          width: 0,
          inside: true,
          overflow: 'truncate',
          formatter: (val: number) => `$${val.toLocaleString()}`
        }
      },
      {
        type: 'value',
        position: 'right',
        axisLabel: {
          width: 0,
          inside: true,
          overflow: 'truncate',
          formatter: '{value} segs'
        }
      }
    ],
    series: [
      ...series,
      {
        name: titleTips[3],
        type: 'line',
        yAxisIndex: 1,
        data: lineData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: { width: 3, color: lineColor },
        itemStyle: { color: lineColor },
      }
    ],
    dataZoom: [
      {
        type: 'slider',
        bottom: 25,
        height: 26,
        handleSize: 18,
        showDetail: false,
      }
    ]
  }
}

export default function Retrieval(){
  const location = useLocation()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const {pathname} = location

  const [loading, setLoading] = useState(true)

  const [dataValue, setDataValue] = useState<DashboardScale>({
    times:{
      realdTimes: 0,
      cacheTimes: 0,
      queryTimes: 0,
      orderTimes: 0
    },
    branches:[],
    agents:[],
    sDates:[],
    cDates:[],
    channels:[],
  })
  const [localTime, setLocalTime] = useState<[Date, Date]>(() => {
    return [dayjs().subtract(7, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
  })

  const dateAirlineRef = useRef<HTMLDivElement | null>(null)
  const dateAirlineInstance = useRef<ECharts | null>(null)
  const airlineCompanyAmtRef = useRef<HTMLDivElement | null>(null)
  const airlineCompanyAmtInstance = useRef<ECharts | null>(null)
  const groupRef = useRef<HTMLDivElement | null>(null)
  const groupInstance = useRef<ECharts | null>(null)
  const agentRef = useRef<HTMLDivElement | null>(null)
  const agentInstance = useRef<ECharts | null>(null)
  const cDateRef = useRef<HTMLDivElement | null>(null)
  const cDateInstance = useRef<ECharts | null>(null)

  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date){
      setLocalTime(date as [Date, Date])
    }
  },[])

  const updateCharts = () => {
    const { date, 'times.realdTimes': dateRealdTimes, 'times.cacheTimes': dateCacheTimes, 'times.queryTimes': dateQueryTimes, 'times.orderTimes': dateOrderTimes } = pluckFields<{
      date:string
      times:DashboardTimers
    }>(dataValue.sDates, [
      'date',
      'times.realdTimes',
      'times.cacheTimes',
      'times.queryTimes',
      'times.orderTimes',
    ])

    if(dateAirlineInstance.current) {
      dateAirlineInstance.current.setOption(
        getBaseOption(
          t('group.agency'),
          date,
          [ dateRealdTimes,dateCacheTimes,dateQueryTimes ],
          dateOrderTimes,
          [{offset: 0, color: 'rgb(149, 212, 117)'},{offset: 1, color: 'rgb(238, 190, 119)'},{offset: 2, color: 'rgb(248, 152, 152)'}],
          primaryColor
        )
      )
    }

    const { channelName, 'queryTimes': channelNameQueryTimes, 'orderTimes': channelNameOrderTimes } = pluckFields(dataValue.channels, [
      'channelName',
      'queryTimes',
      'orderTimes',
    ])

    if (airlineCompanyAmtInstance.current) {
      // airlineCompanyAmtInstance.value.setOption(
      //     getDoubleRingOption(channelName,channelNameQueryTimes,channelNameOrderTimes)
      // )
      airlineCompanyAmtInstance.current.setOption(
        getBaseOption(
          t('home.airline'),
          channelName,
          [channelNameQueryTimes],
          channelNameOrderTimes,
          [{offset: 0, color: 'rgb(149, 212, 117)'}],
          primaryColor,'branch'
        )
      )
    }

    const { agentCode, 'times.realdTimes': agentsRealdTimes, 'times.cacheTimes': agentsCacheTimes, 'times.queryTimes': agentsQueryTimes, 'times.orderTimes': agentsOrderTimes } = pluckFields<{
      agentCode:string
      times:DashboardTimers
    }>(dataValue.agents, [
      'agentCode',
      'times.realdTimes',
      'times.cacheTimes',
      'times.queryTimes',
      'times.orderTimes',
    ])
    if (agentInstance.current) {
      agentInstance.current.setOption(
        getBaseOption(
          t('home.agent'),
          agentCode,
          [agentsRealdTimes, agentsCacheTimes, agentsQueryTimes],
          agentsOrderTimes,
          [{offset: 0, color: 'rgb(149, 212, 117)'},{offset: 1, color: 'rgb(238, 190, 119)'},{offset: 2, color: 'rgb(248, 152, 152)'}],
          primaryColor
        )
      )
    }

    const { branchCode, 'times.realdTimes': branchesRealdTimes, 'times.cacheTimes':branchesCacheTimes, 'times.queryTimes': branchesQueryTimes, 'times.orderTimes': branchesOrderTimes } = pluckFields<{
      branchCode:string
      times:DashboardTimers
    }>(dataValue.branches, [
      'branchCode',
      'times.realdTimes',
      'times.cacheTimes',
      'times.queryTimes',
      'times.orderTimes',
    ])
    if (groupInstance.current) {
      groupInstance.current.setOption(
        getBaseOption(
          t('foundation.company_name'),
          branchCode,
          [branchesRealdTimes, branchesCacheTimes, branchesQueryTimes],
          branchesOrderTimes,
          [{offset: 0, color: 'rgb(149, 212, 117)'},{offset: 1, color: 'rgb(238, 190, 119)'},{offset: 2, color: 'rgb(248, 152, 152)'}],
          primaryColor
        )
      )
    }


    const { 'date':cDatesDate, 'queryTimes': cDatesQueryTimes, 'orderTimes': cDatesOrderTimes } = pluckFields(dataValue.cDates, [
      'date',
      'queryTimes',
      'orderTimes',
    ])

    if (cDateInstance.current) {
      cDateInstance.current.setOption(
        getBaseOption(
          t('order.date'),
          cDatesDate,
          [cDatesQueryTimes],
          cDatesOrderTimes,
          [{offset: 0, color: 'rgb(149, 212, 117)'}],
          primaryColor
        )
      )
    }
  }

  const removeCanvas = () => {
    if(dateAirlineInstance.current){
      dateAirlineInstance.current.dispose()
      dateAirlineInstance.current = null
    }

    if(airlineCompanyAmtInstance.current){
      airlineCompanyAmtInstance.current.dispose()
      airlineCompanyAmtInstance.current = null
    }

    if(agentInstance.current){
      agentInstance.current.dispose()
      agentInstance.current = null
    }

    if(groupInstance.current){
      groupInstance.current.dispose()
      groupInstance.current = null
    }

    if(cDateInstance.current){
      cDateInstance.current.dispose()
      cDateInstance.current = null
    }
    console.log('Uninstall canvas')
  }

  const setCanvas = () => {
    removeCanvas()
    if(groupRef.current){
      groupInstance.current =
        echarts.getInstanceByDom(groupRef.current) || echarts.init(groupRef.current)
    }
    if(dateAirlineRef.current){
      dateAirlineInstance.current =
        echarts.getInstanceByDom(dateAirlineRef.current) || echarts.init(dateAirlineRef.current)
    }
    if (airlineCompanyAmtRef.current) {
      airlineCompanyAmtInstance.current =
        echarts.getInstanceByDom(airlineCompanyAmtRef.current) || echarts.init(airlineCompanyAmtRef.current)
    }
    if (agentRef.current) {
      agentInstance.current =
        echarts.getInstanceByDom(agentRef.current) || echarts.init(agentRef.current)
    }
    if(cDateRef.current){
      cDateInstance.current =
        echarts.getInstanceByDom(cDateRef.current) || echarts.init(cDateRef.current)
    }
    updateCharts()
  }

  const changeSegmented = (val:string|number) => {
    navigate(String(val))
  }

  const getData = async () => {
    try{
      const response = await getDashboardScaleGroup({
        minDate:dayjs((localTime as [Date,Date])[0]).format('YYYY-MM-DD'),
        maxDate:dayjs((localTime as [Date,Date])[1]).format('YYYY-MM-DD'),
        agentIds:[],branchIds:[]
      })

      if(response){
        setDataValue(response)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if(!localTime) return
    getData()
  },[localTime])

  useEffect(() => {
    setCanvas()
  }, [dataValue]);


  return (
    <section className={'containerMain'}>
      <div className={'w-full mb-5 bg-(--bg)'}>
        <Segmented block options={[{label:'当日数据',value:'/'}, {label:'销售数据',value:'/data/sale'}, {label:'查定数据',value:'/data/retrieval'}]} value={pathname} onChange={changeSegmented} />
      </div>
      {
        !loading ?
          <Grid columns={2} gap={8}>
            <Grid.Item span={2}>
              <Card title={t('home.totalQuery')} extra={<Button fill='none'><UndoOutline fontSize={18} color={'#eebe77'} /></Button>}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>{dataValue.times.queryTimes.toLocaleString()}</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('home.totalBookings')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>{dataValue.times.orderTimes.toLocaleString()}</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={1}>
              <Card title={t('home.realTimeQuery')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#eebe77]'}>{dataValue.times.realdTimes.toLocaleString()}</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={1}>
              <Card title={t('home.cacheTimeQuery')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#5cadff]'}>{dataValue.times.cacheTimes.toLocaleString()}</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('group.agency')} extra={
                <DatePicker value={localTime as [Date, Date]} changeDate={changeLocalTime} selectionModeValue={'range'} />
              }>
                <div ref={dateAirlineRef} className={'h-[600px]'}></div>
                <div ref={agentRef} className={'h-[600px]'}></div>
                <div ref={groupRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>

            <Grid.Item span={2}>
              <Card title={t('common.routerChannels')}>
                <div ref={airlineCompanyAmtRef} className={'h-[600px]'}></div>
                <div ref={cDateRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>

          </Grid>
          :
          <Loading />
      }
    </section>
  )
}
