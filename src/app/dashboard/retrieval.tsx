import {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {Card, Grid, Loading, PullToRefresh} from "antd-mobile";
import type {DashboardScale, DashboardTimers} from "@/types/group.ts";

import {getDashboardScaleGroup} from "@/utils/request/group.ts";
import {getCssVar} from "@/utils/public.ts";

import DatePicker from "@/component/Date/datePicker.tsx"
import Charts from "@/component/dashboard/chart.tsx"
import "./dashboard.css"



interface IBaseOption {
  titleTips: string[]
  title: string
  xData: string[],
  barData: any[],
  lineData: number[],
  barColor: { offset: number, color: string }[],
  lineColor: string,
  type?: 'default'|'branch'
  hideTitle?: boolean
}

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

const cardTitle = (icon: string, label: string) => (
  <span className="dashboard-card-title">
    <i className={`iconfont ${icon}`} aria-hidden="true" />
    <span>{label}</span>
  </span>
)


export default function Retrieval(){
  const {t} = useTranslation()

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


  const dateChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const agentChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const groupChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const airlineChartsAmtRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)
  const cDateChartsRef = useRef<{
    setChart: (data: IBaseOption,type: 'default'|'retrieval') => void
    removeChart: () => void
  } | null>(null)


  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date){
      setLocalTime(date as [Date, Date])
    }
  },[])


  const setCanvas = () => {

    if(dateChartsRef.current){
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

      dateChartsRef.current.setChart({
          titleTips:[
            t('home.realTimeQuery'),t('home.cacheTimeQuery'),t('home.totalQuery'),t('home.totalBookings')
          ],
          title:t('group.agency'),
          xData:date,
          barData:[dateRealdTimes,dateCacheTimes,dateQueryTimes],
          lineData:dateOrderTimes,
          barColor: [{offset: 0, color: '#6f5dd1'},{offset: 1, color: '#f0ae57'},{offset: 2, color: '#e77c74'}],
          lineColor:primaryColor,
          type:'default',
          hideTitle:true
        },'retrieval'
      )

    }

    if(agentChartsRef.current){
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
      agentChartsRef.current.setChart({
          titleTips:[
            t('home.realTimeQuery'),t('home.cacheTimeQuery'),t('home.totalQuery'),t('home.totalBookings')
          ],
          title:t('home.agent'),
          xData:agentCode,
          barData:[agentsRealdTimes, agentsCacheTimes, agentsQueryTimes],
          lineData:agentsOrderTimes,
          barColor: [{offset: 0, color: '#6f5dd1'},{offset: 1, color: '#f0ae57'},{offset: 2, color: '#e77c74'}],
          lineColor:primaryColor,
          type:'default',
          hideTitle:true
        },'retrieval'
      )
    }

    if(groupChartsRef.current){
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
      groupChartsRef.current.setChart({
          titleTips:[
            t('home.realTimeQuery'),t('home.cacheTimeQuery'),t('home.totalQuery'),t('home.totalBookings')
          ],
          title:t('order.company_name'),
          xData:branchCode,
          barData:[branchesRealdTimes, branchesCacheTimes, branchesQueryTimes],
          lineData:branchesOrderTimes,
          barColor: [{offset: 0, color: '#6f5dd1'},{offset: 1, color: '#f0ae57'},{offset: 2, color: '#e77c74'}],
          lineColor:primaryColor,
          type:'branch',
          hideTitle:true
        },'retrieval'
      )
    }

    if(cDateChartsRef.current){
      const { 'date':cDatesDate, 'queryTimes': cDatesQueryTimes, 'orderTimes': cDatesOrderTimes } = pluckFields(dataValue.cDates, [
        'date',
        'queryTimes',
        'orderTimes',
      ])

      if(airlineChartsAmtRef.current) {
        const { channelName, 'queryTimes': channelNameQueryTimes, 'orderTimes': channelNameOrderTimes } = pluckFields(dataValue.channels, [
          'channelName',
          'queryTimes',
          'orderTimes',
        ])

        airlineChartsAmtRef.current.setChart(
          {
            titleTips:[
              t('home.realTimeQuery'),t('home.cacheTimeQuery'),t('home.totalQuery'),t('home.totalBookings')
            ],
            title:t('home.airline'),
            xData:channelName,
            barData:[channelNameQueryTimes],
            lineData:channelNameOrderTimes,
            barColor: [{offset: 0, color: '#6f5dd1'}],
            lineColor:primaryColor,
            type:'branch',
            hideTitle:true
          },'retrieval'
        )
      }


      if (cDateChartsRef.current) {
        cDateChartsRef.current.setChart(
          {
            titleTips:[
              t('home.realTimeQuery'),t('home.cacheTimeQuery'),t('home.totalQuery'),t('home.totalBookings')
            ],
            title:t('order.date'),
            xData:cDatesDate,
            barData:[cDatesQueryTimes],
            lineData:cDatesOrderTimes,
            barColor: [{offset: 0, color: '#6f5dd1'}],
            lineColor:primaryColor,
            type:'default',
            hideTitle:true
          },'retrieval'
        )
      }
    }
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
    if (loading) return

    setCanvas()
  }, [loading, dataValue])


  return (
    <div className="dashboard-page retrieval-page">
      {loading && (
        <div className="dashboard-loading">
          <Loading />
        </div>
      )}
      <PullToRefresh onRefresh={getData}>
            <Grid columns={2} gap={8}>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-summary" title={cardTitle('icon-tongji', t('home.totalQuery'))}>
                  <i className="iconfont icon-a-tongjishujuquxianzhishu dashboard-summary__watermark" aria-hidden="true" />
                  <div className="dashboard-summary__content">
                    <span className="dashboard-summary__amount">{dataValue.times.queryTimes.toLocaleString()}</span>
                    <div className="dashboard-summary__profit">
                      <span className="dashboard-summary__label">{t('home.totalBookings')}</span>
                      <strong className="dashboard-summary__value">{dataValue.times.orderTimes.toLocaleString()}</strong>
                    </div>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card className="dashboard-card dashboard-metric dashboard-metric--realtime" title={cardTitle('icon-a-tongjishujuquxianzhishu', t('home.realTimeQuery'))}>
                  <div>
                    <span className="dashboard-metric__value">{dataValue.times.realdTimes.toLocaleString()}</span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={1}>
                <Card className="dashboard-card dashboard-metric dashboard-metric--cache" title={cardTitle('icon-liebiao_o', t('home.cacheTimeQuery'))}>
                  <div>
                    <span className="dashboard-metric__value">{dataValue.times.cacheTimes.toLocaleString()}</span>
                  </div>
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-calendar', t('group.agency'))} extra={
                  <DatePicker value={localTime as [Date, Date]} changeDate={changeLocalTime} selectionModeValue={'range'} />
                }>
                  <Charts ref={dateChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-person', t('home.agent'))}>
                  <Charts ref={agentChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-company', t('order.company_name'))}>
                  <Charts ref={groupChartsRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-hangban-', t('common.routerChannels'))}>
                  <Charts ref={airlineChartsAmtRef} />
                </Card>
              </Grid.Item>
              <Grid.Item span={2}>
                <Card className="dashboard-card dashboard-chart-card" title={cardTitle('icon-calendar1', t('order.date'))}>
                  <Charts ref={cDateChartsRef} />
                </Card>
              </Grid.Item>

            </Grid>
      </PullToRefresh>
    </div>
  )
}
