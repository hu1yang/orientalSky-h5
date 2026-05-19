import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation, useNavigate} from "react-router";
import dayjs from "dayjs";
import DatePicker from "@/component/Date/datePicker.tsx"
import {useTranslation} from "react-i18next";

import {Button, Card, Grid, Loading, Radio, Segmented, Selector, Space} from "antd-mobile";
import {UndoOutline} from "antd-mobile-icons"

import * as echarts from 'echarts/core';
import {BarChart, LineChart, PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, LegendComponent} from 'echarts/components';
import type {ECharts} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";

import {getDashboardTodayGroup, getDashboardTotalGroup} from "@/utils/request/group.ts";
import {getCssVar} from "@/utils/public.ts";
import type {DashboardTotal} from "@/types/group.ts";

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

interface ICounts {
  totalSegments:number
  totalOrders:number
  totalAmount:number
  totalProfit:number
}

const topArr = [
  {label:'All',value:'all'},
  {label:'Top 10',value:'10'},
  {label:'Top 20',value:'20'},
  {label:'Top 30',value:'30'},
  {label:'Top 40',value:'40'},
  {label:'Top 50',value:'50'},
]

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
const priceColor = getCssVar('--price-color')

const getBaseOption = (
  title: string,
  xData: string[],
  barData: number[],
  lineData: number[],
  barColor: {offset:number ,color:string}[],
  lineColor: string,
  types:'total'|'default'|'agent'|'seg'='default'
) => {
  const titleTips =
    types === 'total'
      ? [
        `销售金额 ($ 26,619)`,
        `航段量 (102)`
      ] : ['销售金额', '航段量'];

  return {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 50,
      textStyle: { color: '#555' },
      itemGap: 30,
      data: titleTips
    },
    grid: { left: 5, right: 5, bottom: 60, top: 80, containLabel: true },
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
      {
        name: titleTips[0],
        type: 'bar',
        yAxisIndex: 0,
        data: barData,
        barMaxWidth: 40,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, barColor)
        }
      },
      {
        name: titleTips[1],
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
      // {
      //     type: 'inside',
      // }
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

export default function Home(){
  const location = useLocation()
  const navigate = useNavigate()
  const {t} = useTranslation()
  const {pathname} = location

  const [loading, setLoading] = useState(true)
  const [dataValue, setDataValue] = useState<DashboardTotal>({
    counts:{
      totalSegments: 0,
      totalOrders: 0,
      totalAmount: 0,
      totalProfit: 0
    },
    branches:[],
    agents:[],
    flights:[],
    dates:[],
    channels:[],
    hours:[],
  })
  const [localTime, setLocalTime] = useState<Date|Date[]|null>(null)
  const [tops, setTops] = useState<string>('10')
  const [typesModel, setTypesModel] = useState<'totalAmount'|'totalSegments'>('totalAmount')

  const hourAirlineRef = useRef<HTMLDivElement | null>(null);
  const hourAirlineInstance = useRef<ECharts | null>(null);
  const dateAirlineRef = useRef<HTMLDivElement | null>(null)
  const dateAirlineInstance = useRef<ECharts | null>(null)
  const airlineCompanyAmtRef = useRef<HTMLDivElement | null>(null)
  const airlineCompanyAmtInstance = useRef<ECharts | null>(null)
  const agentRef = useRef<HTMLDivElement | null>(null)
  const agentInstance = useRef<ECharts | null>(null)
  const dateSegmentRef = useRef<HTMLDivElement | null>(null)
  const segmentInstance = useRef<ECharts | null>(null)

  const updateCharts = () => {
    const { hour, 'counts.totalAmount': amountTotalAmountHour, 'counts.totalSegments': amountTotalSegmentsHour } = pluckFields<{
      hour:string
      counts:ICounts
    }>(dataValue.hours || [], [
      'hour',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if(hourAirlineInstance.current) {
      const newHour = hour.map(h => `${String(h).padStart(2, '0')}:00`)
      hourAirlineInstance.current.setOption(
        getBaseOption(
          t('home.todayTotalTurnover'),
          newHour,
          amountTotalAmountHour,
          amountTotalSegmentsHour,
          [{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
          primaryColor,'total'
        )
      )
    }

    const daysArr:{
      date:string
      counts:ICounts
    }[] = dataValue.dates ?? []

    const { date:amountData, 'counts.totalAmount': amountTotalAmount, 'counts.totalSegments': amountTotalSegments } = pluckFields<{
      date:string
      counts:ICounts
    }>(daysArr, [
      'date',
      'counts.totalAmount',
      'counts.totalSegments',
    ])

    if(dateAirlineInstance.current) {
      dateAirlineInstance.current.setOption(
        getBaseOption(
          t('home.todayTotalTurnover'),
          amountData,
          amountTotalAmount,
          amountTotalSegments,
          [{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
          primaryColor,'total'
        )
      )
    }

    const { channelName, 'counts.totalAmount': channelTotalAmount, 'counts.totalSegments': channelTotalSegments } = pluckFields<{
      channelCode:string
      counts:ICounts
    }>(dataValue.channels, [
      'channelName',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (airlineCompanyAmtInstance.current) {
      // airlineCompanyAmtInstance.value.setOption(
      //     getDoubleRingOption(
      //         channelName,
      //         channelTotalAmount,
      //         channelTotalSegments
      //     )
      // )

      airlineCompanyAmtInstance.current.setOption(
        getBaseOption(
          t('home.airline'),
          channelName,
          channelTotalAmount,
          channelTotalSegments,
          [{offset: 0, color: '#1B6428'},{offset: 1, color: '#73C476'}],
          primaryColor,'default'
        )
      )

    }

    const { agentCode, 'counts.totalAmount': agentTotalAmount, 'counts.totalSegments': agentTotalSegments } = pluckFields<{
      agentId:string
      counts:ICounts
    }>(dataValue.agents!, [
      'agentCode',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (agentInstance.current) {
      agentInstance.current.setOption(
        getBaseOption(
          t('home.agent'),
          agentCode,
          agentTotalAmount,
          agentTotalSegments,
          [{offset: 0, color: priceColor}],
          primaryColor,'agent'
        )
      )
    }

  }

  const setCanvas = () => {
    removeCanvas()
    if(hourAirlineRef.current){
      hourAirlineInstance.current =
        echarts.getInstanceByDom(hourAirlineRef.current) || echarts.init(hourAirlineRef.current)
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
    if(dateSegmentRef.current){
      segmentInstance.current =
        echarts.getInstanceByDom(dateSegmentRef.current) || echarts.init(dateSegmentRef.current)
    }
    updateCharts()
  }

  const changeCanvas = () => {
    const sorted = [...dataValue.flights].sort(
      (a, b) => b.counts[typesModel] - a.counts[typesModel]
    )

    const data = tops !== 'all' ? sorted.slice(0, Number(tops)) : sorted

    const { flightCode, 'counts.totalAmount': flightTotalAmount, 'counts.totalSegments': flightTotalSegments } = pluckFields<{
      flightCode:string
      counts:ICounts
    }>(data, [
      'flightCode',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (segmentInstance.current) {
      segmentInstance.current.setOption(
        getBaseOption(
          t('order.sequence'),
          flightCode,
          flightTotalAmount,
          flightTotalSegments,
          [{offset: 0, color: '#174A91'},{offset: 1, color: '#68ADD6'}],
          primaryColor,'seg'
        )
      )
    }
  }

  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date){
      setLocalTime(date)
    }
  },[])


  const removeCanvas = () => {
    if(hourAirlineInstance.current){
      hourAirlineInstance.current.dispose()
      hourAirlineInstance.current = null
    }

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

    if(segmentInstance.current){
      segmentInstance.current.dispose()
      segmentInstance.current = null
    }
    console.log('Uninstall canvas')
  }

  const getData = async () => {
    try{
      let response
      if(pathname === '/'){
        response = await getDashboardTodayGroup({
          localTime:dayjs(localTime as Date).format('YYYY-MM-DDTHH:mm:ssZ'),agentIds:[],carrier:'',channelCodes:[]
        })
      }else{
        response = await getDashboardTotalGroup({
          minTime:dayjs((localTime as [Date,Date])[0]).format('YYYY-MM-DDTHH:mm:ssZ'),
          maxTime:dayjs((localTime as [Date,Date])[1]).format('YYYY-MM-DDTHH:mm:ssZ'),
          agentIds:[],carrier:'',channelCodes:[],branchIds:[],isTravelDateTime:false
        })
      }

      if(response){
        setDataValue(response)
      }
    } finally {
      setLoading(false)
    }
  }

  const changeSegmented = (val:string|number) => {
    navigate(String(val))
  }

  useEffect(() => {
    const initData = async () => {
      const local = pathname === '/'
        ? dayjs().toDate()
        : [dayjs().subtract(7, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
      setLocalTime(local)
    }
    initData()
  }, [pathname]);

  useEffect(() => {
    if(!localTime) return
    getData()
  },[localTime])

  useEffect(() => {
    setCanvas()
  }, [dataValue]);

  useEffect(() => {
    changeCanvas()
  }, [tops,typesModel,dataValue]);

  return (
    <section className={'containerMain'}>
      <div className={'w-full mb-5 bg-(--bg)'}>
        <Segmented block options={[{label:'当日数据',value:'/'}, {label:'销售数据',value:'/data/sale'}, {label:'查定数据',value:'/data/retrieval'}]} value={pathname} onChange={changeSegmented} />
      </div>
      {
        !loading ?
          <Grid columns={2} gap={8}>
            <Grid.Item span={2}>
              <Card title={t('home.totalTransaction')} extra={<Button fill='none'><UndoOutline fontSize={18} color={'#eebe77'} /></Button>}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$23,108</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('home.discountAmount')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$1,318</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={1}>
              <Card title={t('home.ticketing')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#eebe77]'}>61</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={1}>
              <Card title={t('home.segment')}>
                <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#5cadff]'}>86</span>
                </div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={
                pathname === '/'
                  ? t('home.todayTotalTurnover')
                  : t('home.totalTurnover')
              } extra={
                  <DatePicker value={localTime as Date | [Date, Date]} changeDate={changeLocalTime} selectionModeValue={pathname === '/' ? 'single':'range'} />
              }>
                <div ref={  pathname === '/'
                  ? hourAirlineRef
                  : dateAirlineRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('home.agent')}>
                <div ref={agentRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('home.airline')}>
                <div ref={airlineCompanyAmtRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>
            <Grid.Item span={2}>
              <Card title={t('order.sequence')}>
                <Radio.Group value={typesModel} onChange={v => setTypesModel(v)}>
                  <Space direction='horizontal'>
                    {
                      [{label:t('home.salesAmount'),value:'totalAmount'},{label:t('home.flightSegmentsnumber'),value:'totalSegments'}].map(item => (
                        <Radio value={item.value}  style={{
                          '--icon-size': '18px',
                          '--font-size': '14px',
                          '--gap': '6px',
                        }}>{item.label}</Radio>
                      ))
                    }
                  </Space>
                </Radio.Group>
                <Selector
                  className={'mt-4'}
                  options={topArr}
                  value={[tops]}
                  style={{
                    '--padding': '4px 8px',
                  }}
                  onChange={v => {
                    if (v.length) {
                      setTops(v[0])
                    }
                  }}
                />

                <div ref={dateSegmentRef} className={'h-[600px]'}></div>
              </Card>
            </Grid.Item>
          </Grid>
          :
          <Loading />
      }
    </section>
  )
}
