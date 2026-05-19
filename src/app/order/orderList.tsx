import {memo, useCallback, useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {Button, Card, Divider, Grid, InfiniteScroll, PullToRefresh, Space, Tag} from "antd-mobile";
import {CouponOutline, LockOutline, UnlockOutline} from "antd-mobile-icons";

import CardText from "@/component/card/cardText.tsx";
import SegmentBox from "@/component/order/segment.tsx";
import {calculateTotalPriceByPassengers} from "@/utils/order.tsx";
import {copyText} from "@/utils/public.ts";

import type {IOrderManual, IOrderManualSearchForm, ITicketStatus} from "@/types/order.ts";
import {getOperationLogsOrderGroup, getOrdersListGroup} from "@/utils/request/group.ts";

import {selectAgentMap} from "@/store/modules/base.ts";
import Log from "@/component/default/log.tsx";
import type {OrderInfo} from "@/types/group.ts";


const statusArs = {
  created:'routerTicketCreated',
  confirming:'routerTicketConfirming',
  confirmed:'routerTicketConfirmed',
  userPaid:'routerTicketUserPaid',
  ticketing:'routerTicketTicketing',
  processing:'routerTicketProcessing',
  switching:'routerTicketSwitching',
  following:'routerTicketFollowing',
  ticketed:'routerTicketTicketed',
  completed:'routerTicketCompleted',
  cancelled:'routerTicketCancelled'
}

type IOrderManualBr =  IOrderManual & {
  branchCode: string
  agentCode:string
}
const ListCard = memo(({listValue,getlogFnc}:{listValue:IOrderManualBr,getlogFnc:(id:string) => void}) => {
  const {t} = useTranslation()

  const getlog = (id:string) => {
    getlogFnc(id)
  }

  return (
    <Card className={'mb-2'}
          title={
            <div className={'flex items-center'}>
              <div className={'flex items-center mr-2'}>
                          <span className={'text-[1.2rem] ml-2 font-bold text-(--warning-color) mr-3'} onClick={() => copyText(listValue.id)}>
                            {listValue.id}
                          </span>
                <CouponOutline color={'var(--warning-color)'} fontSize={14} />
              </div>
              <Tag round color={listValue.status === 'cancelled' ? 'danger' : 'primary'}>{t('common.' + statusArs[(listValue.status as ITicketStatus)])}</Tag>
            </div>
          }
          extra={
            <Button size={'mini'} fill='none'>
              <Space style={{
                display:'flex',
                alignItems:'stretch'
              }}>
                {
                  listValue.lockedBy ? <LockOutline fontSize={20} /> : <UnlockOutline fontSize={20} />
                }
                {
                  listValue.lockedBy && (
                    <span className={'text-[1.2rem]'}>{listValue.lockedBy}</span>
                  )
                }
              </Space>
            </Button>
          }
          key={listValue.id}>
      <div className={'w-full mb-5'}>
        <CardText label={t('foundation.agent')} value={`${listValue.branchCode} ${listValue.agentCode}`} labelStyle={'!w-20'} />
        <CardText label={t('order.passenger')} value={
          <Space style={{ '--gap': '4px' }} direction='vertical' wrap>
            {
              listValue.passengers?.map(passenger => (
                <div key={passenger.id} className={'break-all'}>
                  <span className={`${passenger.passengerType !== 'adt' && 'text-(--warning-color)'} `}>{passenger.fullName}({passenger.passengerType})</span>
                  {
                    passenger.ticketNumbers.map(ticketNumber => (
                      <span key={ticketNumber.id} className={'text-(--success-color) ml-3'} onClick={() => copyText(`${ticketNumber.ticketNumber}(${ticketNumber.bookingNumber})`)}>{ticketNumber.ticketNumber}({ticketNumber.bookingNumber})</span>
                    ))
                  }
                </div>
              ))
            }
          </Space>
        } labelStyle={'!w-20'} style={'!items-start'} />
      </div>
      <SegmentBox itineraries={listValue.itineraries} />
      <div className={'flex items-baseline justify-center my-5'}>
        <p className={'font-bold text-[2.2rem] text-(--price-color)'}>${calculateTotalPriceByPassengers(listValue.passengers, listValue.itineraries.flatMap(it => it.amounts)).toFixed(2)}</p>
        <span className={'text-[1.2rem] text-(--price-color) ml-2'}>({listValue.currency})</span>
      </div>
      <div className={'w-full'}>
        <CardText label={t('order.createdTime')} value={dayjs(listValue.createdTime).format('YYYY-MM-DD HH:mm')} labelStyle={'!w-auto mr-4'} />
      </div>
      <Divider />
      <div className={'w-full'}>
        <Grid columns={2} gap={8}>
          <Grid.Item>
            <Button block color='primary' shape='rounded' size='small'>
              {t('order.detail')}
            </Button>
          </Grid.Item>
          <Grid.Item>
            <Button block color='default' shape='rounded' size='small' onClick={() => getlog(listValue.id)}>
              {t('common.routerLog')}
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    </Card>
  )
})

export default function OrderList(){
  const initRef = useRef(false)
  const {status} = useParams()
  const agentMap = useSelector(selectAgentMap)

  const [hasMore, setHasMore] = useState(false)
  const loadingRef = useRef(false)
  const pageRef = useRef(1)
  const [searchForm, setSearchForm] = useState<IOrderManualSearchForm>({
    searchKey:'',
    branchId:'',
    agentId:'',
    bookingOrderId:'',
    bookingNumber:'',
    flightNumber:'',
    shuttleNumber: '',
    id: '',
    linkedNumber: '',
    travelerName: '',
    travelerIdNo: '',
    travelerType: null,
    travelerSex: null,
    travelerCountry: '',
    isLockedBy: null,
    minTime: '',
    maxTime: '',
    minTLimit: '',
    maxTLimit: '',
    status: status ? status as ITicketStatus : null,
    sourceType: '',
    carrier:'',
    teamedKey:'',
    ticketNumber:'',
    minTravelTime:'',
    maxTravelTime:'',
    resultType:'',
    departureAirport:'',
    arrivalAirport:''
  })
  const [listValue, setListValue] = useState<IOrderManualBr[]>([])

  const logRef = useRef<{
    showLog:(logList:OrderInfo[]) => void
  }|null>(null);

  const getlog = useCallback((id:string) => {
    getOperationLogsOrderGroup({page:0,pageSize:50},id).then(res=>{
      if(res.length){
        if(logRef){
          logRef.current?.showLog(res)
        }
      }
    })
  },[])

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const resetData = async () => {
    await getData(1,true)
  }

  const getData = (nextPage:number,reset:boolean = false) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setHasMore(false)
    try {
      getOrdersListGroup({pageSize:20,page:nextPage},searchForm).then(res => {
        if(res){
          const value = res.items.map(item => {
            const info = agentMap.get(item.agentId)

            return {
              ...item,
              branchCode: info?.branchCode,
              agentCode: info?.agentCode
            }
          })
          if(reset){
            setListValue(value)
          }else{
            setListValue(prev => [...prev, ...value])
          }
          setHasMore(res.items.length === 20)
        }
      })
    } finally {
      loadingRef.current = false
    }
  }

  useEffect(() => {
    if (initRef.current) return
    initRef.current = true
    getData(pageRef.current,true)
  }, []);

  return (
    <section className={'containerMain'}>
      <div className="p-2">
        <PullToRefresh onRefresh={resetData}>
          {
            listValue.map(item => (
              <ListCard key={item.id} listValue={item} getlogFnc={getlog} />
            ))
          }
        </PullToRefresh>
        {
          !!listValue.length && (
            <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
          )
        }
      </div>
      <Log ref={logRef} />
    </section>
    )
}
