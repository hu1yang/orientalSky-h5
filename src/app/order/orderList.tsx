import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useLocation, useNavigate, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {Button, Card, Divider, Grid, InfiniteScroll, Loading, PullToRefresh, Space, Tag, Toast} from "antd-mobile";
import {CouponOutline, LockOutline, UnlockOutline} from "antd-mobile-icons";

import CardText from "@/component/card/cardText.tsx";
import SegmentBox from "@/component/order/segment.tsx";
import {
  calculateTotalPriceByPassengers,
  statusArs,
  statusArsAuxiliary,
  statusArsChange,
  statusArsRefund
} from "@/utils/order.ts";
import {copyText} from "@/utils/public.ts";

import type {
  IOrderAuxiliary,
  IOrderChange,
  IOrderManual,
  IOrderManualSearchForm,
  IOrderRefund,
  IOrderRefundSearchForm,
  ITicketStatus, Passenger, IRefundStatus, IChangeStatus, IAuxiliaryStatus, IOrderChangeSearchForm,
  IOrderAuxiliarySearchForm
} from "@/types/order.ts";
import {
  getAppendsListGroup,
  getChangesListGroup,
  getOperationLogsOrderGroup,
  getOrdersListGroup,
  getRefundsListGroup
} from "@/utils/request/group.ts";

import {selectAgentMap} from "@/store/modules/base.ts";
import Log from "@/component/default/log.tsx";
import type {OrderInfo} from "@/types/group.ts";



type StatusMap = {
  ticket: Record<ITicketStatus, string>
  refund: Record<IRefundStatus, string>
  change: Record<IChangeStatus, string>
  auxiliary: Record<IAuxiliaryStatus, string>
}

const statusMap: StatusMap = {
  ticket: statusArs,
  refund: statusArsRefund,
  change: statusArsChange,
  auxiliary: statusArsAuxiliary,
}

const ListCard = memo(({listValue, getlogFnc, pathType}: {
  listValue: IOrderManual | IOrderRefund | IOrderChange | IOrderAuxiliary
  getlogFnc: (id: string) => void
  pathType:'ticket'|'refund'|'change'|'auxiliary'
}) => {
  const {t} = useTranslation()
  const navigate = useNavigate()

  const orderInfo =
    pathType === 'ticket'
      ? listValue as IOrderManual
      : (listValue as IOrderRefund | IOrderChange | IOrderAuxiliary).order

  const passengers = orderInfo?.passengers ?? []
  const currency = orderInfo?.currency ?? ''
  const itineraries = orderInfo?.itineraries ?? []

  const orderStatus = listValue.status as keyof typeof statusMap[typeof pathType]
  const statusShow = t(`common.${statusMap[pathType][orderStatus]}`)


  const toDetail = () => {
    if(pathType === 'ticket'){
      navigate(`/ticketDetail/${orderInfo?.id}`)
    }else{
      navigate(`/ticketDetail/${orderInfo?.id}/${pathType}/${listValue.id}`)
    }
  }

  return (
    <Card className={'mb-2'}
          title={
            <div className={'flex items-center'}>
              <div className={'flex items-center mr-2'}>
                <div className={'flex flex-col'}>
                  {
                    pathType === 'ticket' ?
                      <span className={'text-[1.2rem] ml-2 font-bold text-(--active-color) mr-3'} onClick={() => copyText(listValue.id)}>
                        {listValue.id}
                      </span>:
                      <>
                        <span className={'text-[1.2rem] ml-2 font-bold text-(--active-color) mr-3'} onClick={() => copyText(orderInfo?.id as string)}>
                        {orderInfo?.id}
                      </span>
                        <span className={'text-[1.2rem] ml-2 font-bold text-(--warning-color) mr-3'} onClick={() => copyText(listValue.id)}>
                        {listValue.id}
                      </span>
                      </>
                  }

                </div>

                <CouponOutline color={'var(--warning-color)'} fontSize={14} />
              </div>
              <Tag round
                   color={listValue.status === 'cancelled' ? 'danger' : 'primary'}>{statusShow}</Tag>
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
        <CardText label={t('foundation.agent')} value={`${listValue?.branchCode} ${listValue?.agentCode}`} labelStyle={'!w-20'} />
        <CardText label={t('order.passenger')} value={
          <Space style={{ '--gap': '4px' }} direction='vertical' wrap>
            {
              passengers && passengers.map((passenger:Passenger) => (
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
      <SegmentBox itineraries={itineraries} />
      <div className={'flex items-baseline justify-center my-5'}>
        <p className={'font-bold text-[2.2rem] text-(--price-color)'}>${calculateTotalPriceByPassengers(passengers, itineraries.flatMap(it => it.amounts)).toFixed(2)}</p>
        <span className={'text-[1.2rem] text-(--price-color) ml-2'}>({currency})</span>
      </div>
      <div className={'w-full'}>
        <CardText label={t('order.createdTime')} value={dayjs(listValue.createdTime).format('YYYY-MM-DD HH:mm')} labelStyle={'!w-auto mr-4'} />
        {
          pathType !== 'ticket' &&
            <CardText label={t('order.notes')} value={listValue.remarks} style={'items-start'} labelStyle={'!w-auto mr-4'} valueStyle={'!text-(--text)'} />
        }
      </div>
      <Divider />
      <div className={'w-full'}>
        <Grid columns={2} gap={8}>
          <Grid.Item>
            <Button block color='primary' shape='rounded' size='small' onClick={toDetail}>
              {t('order.detail')}
            </Button>
          </Grid.Item>
          <Grid.Item>
            <Button block color='default' shape='rounded' size='small' onClick={() => getlogFnc(listValue.id)}>
              {t('common.routerLog')}
            </Button>
          </Grid.Item>
        </Grid>
      </div>
    </Card>
  )
})

export default function OrderList(){
  const location = useLocation()
  const {pathname} = location
  const {status} = useParams()
  const agentMap = useSelector(selectAgentMap)

  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(false)

  const pageRef = useRef(1)
  const [searchForm, setSearchForm] = useState<IOrderManualSearchForm|IOrderRefundSearchForm|IOrderChangeSearchForm|IOrderAuxiliarySearchForm>({
    // searchKey:'',
    // branchId:'',
    // agentId:'',
    // bookingOrderId:'',
    // bookingNumber:'',
    // flightNumber:'',
    // shuttleNumber: '',
    // id: '',
    // linkedNumber: '',
    // travelerName: '',
    // travelerIdNo: '',
    // travelerType: null,
    // travelerSex: null,
    // travelerCountry: '',
    // isLockedBy: null,
    // minTime: '',
    // maxTime: '',
    // minTLimit: '',
    // maxTLimit: '',
    // status: status ? status as ITicketStatus : null,
    // sourceType: '',
    // carrier:'',
    // teamedKey:'',
    // ticketNumber:'',
    // minTravelTime:'',
    // maxTravelTime:'',
    // resultType:'',
    // departureAirport:'',
    // arrivalAirport:''
  })
  const [listValue, setListValue] = useState<(IOrderManual | IOrderRefund | IOrderChange | IOrderAuxiliary)[]>([])

  const pathType = useMemo(()=>{
    if(pathname.includes('order/ticket')){
      return 'ticket'
    } else if(pathname.includes('order/refund')){
      return 'refund'
    } else if(pathname.includes('order/change')){
      return 'change'
    }else{
      return 'auxiliary'
    }
  },[pathname])

  const logRef = useRef<{
    showLog:(logList:OrderInfo[]) => void
  }|null>(null);

  const getlog = useCallback((id:string) => {
    getOperationLogsOrderGroup({page:0,pageSize:50},id).then(res=>{
      if(res.length){
        if(logRef){
          logRef.current?.showLog(res)
        }
      }else{
        Toast.show({
          content: 'No Data',
        })
      }
    })
  },[])

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const resetData = async () => {
    pageRef.current = 1
    await getData(1,true)
  }

  const getData = async (nextPage:number,reset:boolean = false) => {
    if(reset) setLoading(true)
    try {
      let response
      if(pathType === 'ticket'){
        response = await getOrdersListGroup({pageSize:20,page:nextPage},searchForm as IOrderManualSearchForm)
      } else if(pathType === 'refund'){
        response = await getRefundsListGroup({pageSize:20,page:nextPage},searchForm as IOrderRefundSearchForm)
      } else if(pathType === 'change'){
        response = await getChangesListGroup({pageSize:20,page:nextPage},searchForm as IOrderChangeSearchForm)
      } else {
        response = await getAppendsListGroup({pageSize:20,page:nextPage},searchForm as IOrderAuxiliarySearchForm)
      }
      if(response){
        const value = response.items.map(item => {
          const info = agentMap.get(pathType === 'ticket' ? (item as IOrderManual)?.agentId : (item as IOrderRefund | IOrderChange | IOrderAuxiliary).order?.agentId)

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
        setHasMore(response.items.length === 20)
      }
    } finally {
      setLoading(false)
    }
  }


  useEffect(() => {
    resetData()
  }, [pathType]);


  return (
    <div className="p-2">
      {
        !loading ? <>
            <PullToRefresh onRefresh={resetData}>
              {
                listValue.map(item => (
                  <ListCard key={item.id} listValue={item} getlogFnc={getlog} pathType={pathType} />
                ))
              }
            </PullToRefresh>
            {
              !!listValue.length && (
                <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
              )
            }
          </>:
          <Loading />
      }

      <Log ref={logRef} />
    </div>
    )
}
