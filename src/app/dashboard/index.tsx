import {useCallback, useEffect, useRef, useState} from "react";
import {useLocation} from "react-router";
import dayjs from "dayjs";
import DatePicker from "@/component/Date/datePicker.tsx"
import {useTranslation} from "react-i18next";

import {Card, Grid, Loading, PullToRefresh, Radio, Selector, Space} from "antd-mobile";

import {getDashboardTodayGroup, getDashboardTotalGroup} from "@/utils/request/group.ts";
import {getCssVar} from "@/utils/public.ts";
import type {DashboardTotal} from "@/types/group.ts";

import Charts from "@/component/dashboard/chart.tsx"
import "./dashboard.css"

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
  hideTitle?: boolean
}

const topArr = [
  {label:'All',value:'all'},
  {label:'Top 10',value:'10'},
  {label:'Top 20',value:'20'},
  {label:'Top 30',value:'30'},
  {label:'Top 40',value:'40'},
  {label:'Top 50',value:'50'},
]

const cardTitle = (icon: string, label: string) => (
  <span className="dashboard-card-title">
    <i className={`iconfont ${icon}`} aria-hidden="true" />
    <span>{label}</span>
  </span>
)

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
        barColor: [{offset: 0, color: '#6f5dd1'},{offset: 1, color: '#b9afe9'}],
        lineColor:primaryColor,
        hideTitle:true
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
        barColor:[{offset: 0, color: '#6f5dd1'},{offset: 1, color: '#b9afe9'}],
        lineColor:primaryColor,
        hideTitle:true
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
        barColor:[{offset: 0, color: '#2f9b78'},{offset: 1, color: '#91d8c0'}],
        lineColor:primaryColor,
        hideTitle:true
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
        barColor: [{offset: 0, color: '#e77c58'},{offset: 1, color: '#f3b39c'}],
        lineColor:primaryColor,
        hideTitle:true
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
        barColor:[{offset: 0, color: '#3d82bd'},{offset: 1, color: '#91c9e8'}],
        lineColor:primaryColor,
        hideTitle:true
      },'default')
    }
  }

  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date){
      setLocalTime(date)
    }
  },[])

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
    if (loading) return

    setCanvas()
    changeCanvas()
  }, [loading, dataValue, tops, typesModel])

  useEffect(() => {
    changeCanvas()
  }, [tops,typesModel,dataValue.flights]);

  return (
    <div className="p-2 dashboard-page">
      {loading && (
        <div className="dashboard-loading">
          <Loading />
        </div>
      )}
      {localTime && (
        <PullToRefresh onRefresh={getData}>
            <Grid columns={2} gap={8}>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-summary" title={cardTitle('icon-tongji', t('home.totalTransaction'))} extra={
                  pathname !== '/' && (
                    <div className="dashboard-date-mode" role="group" aria-label={t('home.timeZone')}>
                      <button
                        type="button"
                        className={!isTravelDateTime ? 'is-active' : ''}
                        aria-pressed={!isTravelDateTime}
                        onClick={() => setIsTravelDateTime(false)}
                      >
                        {t('common.orderDate')}
                      </button>
                      <button
                        type="button"
                        className={isTravelDateTime ? 'is-active' : ''}
                        aria-pressed={isTravelDateTime}
                        onClick={() => setIsTravelDateTime(true)}
                      >
                        {t('common.departureDate')}
                      </button>
                    </div>
                  )
                }>
                  <i className="iconfont icon-plane-trip-international dashboard-summary__watermark" aria-hidden="true" />
                  <div className="dashboard-summary__content">
                  <span className="dashboard-summary__amount">$
                    {(() => {
                      const totalAmount = dataValue.counts.totalAmount ?? 0;
                      const [intPart] = totalAmount.toLocaleString().split('.');
                      return intPart
                    })()}
                  </span>
                    <div className="dashboard-summary__profit">
                      <span className="dashboard-summary__label">{t('home.discountAmount')}</span>
                      <strong className="dashboard-summary__value">${(dataValue.counts.totalProfit ?? 0).toLocaleString()}</strong>
                    </div>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card className="dashboard-card dashboard-metric" title={cardTitle('icon-chupiao', t('home.ticketing'))}>
                  <div>
                  <span className="dashboard-metric__value">
                    {dataValue.counts.totalOrders.toLocaleString()}
                  </span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card className="dashboard-card dashboard-metric dashboard-metric--segments" title={cardTitle('icon-hangban', t('home.segment'))}>
                  <div>
                  <span className="dashboard-metric__value">{
                    dataValue.counts.totalSegments.toLocaleString()
                  }</span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={
                  cardTitle(
                    'icon-a-tongjishujuquxianzhishu',
                    pathname === '/' ? t('home.todayTotalTurnover') : t('home.totalTurnover')
                  )
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
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-person', t('home.agent'))}>
                  <Charts ref={agentChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-hangban-', t('home.airline'))}>
                  <Charts ref={airlineChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-liebiao_o', t('order.sequence'))}>
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
                      '--border-radius':'1rem'
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
      )}
    </div>
  )
}
