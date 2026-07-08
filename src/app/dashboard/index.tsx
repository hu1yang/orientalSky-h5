import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router";
import dayjs from "dayjs";
import DatePicker from "@/component/Date/datePicker.tsx"
import {useTranslation} from "react-i18next";

import {Card, Grid, Loading, PullToRefresh, Radio, Segmented, Selector, Space} from "antd-mobile";

import {getDashboardTodayGroup, getDashboardTotalGroup} from "@/utils/request/group.ts";
import {getCssVar} from "@/utils/public.ts";
import type {DashboardTotal} from "@/types/group.ts";

import Charts from "@/component/dashboard/chart.tsx"

interface ICounts {
  totalSegments:number
  totalOrders:number
  totalAmount:number
  totalProfit:number
}

interface IBaseOption {
  titleTips: string[]
  title: string
  xData: string[],
  barData: number[],
  lineData: number[],
  barColor: { offset: number, color: string }[],
  lineColor: string,
  type?: 'default'|'branch'
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

export default function Home(){
  const location = useLocation()
  const {pathname} = location

  const {t} = useTranslation()

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
  const [isTravelDateTime, setIsTravelDateTime] = useState(false)
  const [localTime, setLocalTime] = useState<Date|Date[]|null>(null)
  const [tops, setTops] = useState<string>('10')
  const [typesModel, setTypesModel] = useState<'totalAmount'|'totalSegments'>('totalAmount')

  const dateChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null);
  const hourChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null);
  const agentChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const airlineChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const segmentChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)

  const setCanvas = () => {
    if(hourChartsRef.current){
      const { hour, 'counts.totalAmount': amountTotalAmountHour, 'counts.totalSegments': amountTotalSegmentsHour } = pluckFields<{
        hour:string
        counts:ICounts
      }>(dataValue.hours || [], [
        'hour',
        'counts.totalAmount',
        'counts.totalSegments',
      ])
      const newHour = hour.map(h => `${String(h).padStart(2, '0')}:00`)
      hourChartsRef.current.setChart({
        titleTips:[
          `${t('home.salesAmount')} ($ ${dataValue.counts.totalAmount.toLocaleString()})`,
          `${t('home.flightSegmentsnumber')} (${dataValue.counts.totalSegments.toLocaleString()})`
        ],
        title:t('home.todayTotalTurnover'),
        xData:newHour,
        barData:amountTotalAmountHour,
        lineData:amountTotalSegmentsHour,
        barColor: [{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
        lineColor:primaryColor
      },'default')
    }
    if(dateChartsRef.current){
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
      dateChartsRef.current.setChart({
        titleTips:[t('home.salesAmount'), t('home.flightSegmentsnumber')],
        title:pathname === '/'
          ? t('home.todayTotalTurnover')
          : t('home.totalTurnover'),
        xData:amountData,
        barData:amountTotalAmount,
        lineData:amountTotalSegments,
        barColor:[{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
        lineColor:primaryColor
      },'default')
    }
    if(airlineChartsRef.current){
      const { channelName, 'counts.totalAmount': channelTotalAmount, 'counts.totalSegments': channelTotalSegments } = pluckFields<{
        channelCode:string
        counts:ICounts
      }>(dataValue.channels, [
        'channelName',
        'counts.totalAmount',
        'counts.totalSegments',
      ])
      airlineChartsRef.current.setChart({
        titleTips:[t('home.salesAmount'), t('home.flightSegmentsnumber')],
        title:t('home.airline'),
        xData:channelName,
        barData:channelTotalAmount,
        lineData:channelTotalSegments,
        barColor:[{offset: 0, color: '#1B6428'},{offset: 1, color: '#73C476'}],
        lineColor:primaryColor
      },'default')
    }
    if(agentChartsRef.current){
      const { agentCode, 'counts.totalAmount': agentTotalAmount, 'counts.totalSegments': agentTotalSegments } = pluckFields<{
        agentId:string
        counts:ICounts
      }>(dataValue.agents!, [
        'agentCode',
        'counts.totalAmount',
        'counts.totalSegments',
      ])

      agentChartsRef.current.setChart({
        titleTips:[t('home.salesAmount'), t('home.flightSegmentsnumber')],
        title:t('home.agent'),
        xData:agentCode,
        barData:agentTotalAmount,
        lineData:agentTotalSegments,
        barColor: [{offset: 0, color: priceColor}],
        lineColor:primaryColor
      },'default')
    }
  }

  const changeCanvas = () => {
    if(segmentChartsRef.current){
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

      segmentChartsRef.current.setChart({
        titleTips:[t('home.salesAmount'), t('home.flightSegmentsnumber')],
        title:t('order.sequence'),
        xData:flightCode,
        barData:flightTotalAmount,
        lineData:flightTotalSegments,
        barColor:[{offset: 0, color: '#174A91'},{offset: 1, color: '#68ADD6'}],
        lineColor:primaryColor
      },'default')
    }
  }

  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date){
      setLocalTime(date)
    }
  },[])


  const removeCanvas = () => {
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
          agentIds:[],carrier:'',channelCodes:[],branchIds:[],isTravelDateTime:isTravelDateTime
        })
      }

      if(response){
        setDataValue(response)
      }
    } catch {
      setDataValue({
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
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initData = () => {
      const local = pathname === '/'
        ? dayjs().toDate()
        : [dayjs().subtract(7, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]
      setLocalTime(local)
    }
    initData()
  }, [pathname]);

  useEffect(() => {
    if(!localTime) return
    const initData = async () => {
      getData()
    }
    initData()
  },[localTime,isTravelDateTime])

  useEffect(() => {
    setCanvas()
    return () => {
      removeCanvas()
    }
  }, [dataValue]);

  useEffect(() => {
    changeCanvas()
  }, [tops,typesModel,dataValue.flights]);

  return (
    <div>
      {
        !loading ?
          <PullToRefresh onRefresh={getData}>
            <Grid columns={2} gap={8}>
              <Grid.Item span={2}>
                <Card title={t('home.totalTransaction')} extra={
                  pathname !== '/' && (
                    <Segmented block options={[
                      {label:t('common.orderDate'),value:0},
                      {label:t('common.departureDate'),value:1},
                    ]} value={isTravelDateTime ? 1 : 0} onChange={(val) => setIsTravelDateTime(!!val)} />
                  )
                }>
                  <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$
                    {(() => {
                      const totalAmount = dataValue.counts.totalAmount ?? 0;
                      const [intPart] = totalAmount.toLocaleString().split('.');
                      return intPart
                    })()}
                  </span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card title={t('home.discountAmount')}>
                  <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$
                    {(() => {
                      const totalProfit = dataValue.counts.totalProfit ?? 0;
                      const [intPart] = totalProfit.toLocaleString().split('.');
                      return intPart
                    })()}
                  </span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card title={t('home.ticketing')}>
                  <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#eebe77]'}>
                    {dataValue.counts.totalOrders.toLocaleString()}
                  </span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card title={t('home.segment')}>
                  <div className={'flex justify-start'}>
                  <span className={'text-left font-bold text-[2rem]/[2rem] text-[#5cadff]'}>{
                    dataValue.counts.totalSegments.toLocaleString()
                  }</span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card title={
                  pathname === '/'
                    ? t('home.todayTotalTurnover')
                    : t('home.totalTurnover')
                } extra={
                  pathname === '/' ?
                    <DatePicker value={localTime as Date} changeDate={changeLocalTime} selectionModeValue={'single'} />:
                    <DatePicker value={localTime as[Date, Date]} changeDate={changeLocalTime} selectionModeValue={'range'} />
                }>
                  <Charts ref={pathname === '/'
                    ? hourChartsRef
                    : dateChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card title={t('home.agent')}>
                  <Charts ref={agentChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card title={t('home.airline')}>
                  <Charts ref={airlineChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card title={t('order.sequence')}>
                  <Radio.Group value={typesModel} onChange={v => setTypesModel(v as 'totalAmount'|'totalSegments')}>
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

                  <Charts ref={segmentChartsRef} />
                </Card>
              </Grid.Item>
            </Grid>
          </PullToRefresh>
          :
          <Loading />
      }
    </div>
  )
}
