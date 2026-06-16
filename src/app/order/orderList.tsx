import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useNavigate, useParams} from "react-router";
import {useSelector} from "react-redux";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {
  Button,
  Card, Dialog,
  Divider, Form,
  Grid,
  InfiniteScroll, Input,
  Loading, Popup,
  PullToRefresh,
  Radio,
  SearchBar, Segmented,
  Space,
  Tag,
  Toast
} from "antd-mobile";
import {CouponOutline, FilterOutline, LockOutline, UnlockOutline} from "antd-mobile-icons";

import CardText from "@/component/card/cardText.tsx";
import SegmentBox from "@/component/order/segment.tsx";
import {
  calculateTotalPriceByPassengers,
  statusArs,
  statusArsAuxiliary,
  statusArsChange,
  statusArsRefund
} from "@/utils/order.ts";
import {copyText, result} from "@/utils/public.ts";

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
  changeAppendLockedByGroup,
  changeChangeLockedByGroup,
  changeOrderLockedByGroup, changeRefundLockedByGroup,
  getAppendsListGroup,
  getChangesListGroup,
  getOperationLogsOrderGroup,
  getOrdersListGroup,
  getRefundsListGroup
} from "@/utils/request/group.ts";

import {selectAgentMap} from "@/store/modules/base.ts";
import Log from "@/component/default/log.tsx";
import type {OrderInfo} from "@/types/group.ts";
import AgentSearch from "@/component/default/agentSearch.tsx";
import NoData from "@/component/default/noData.tsx";



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

const ticketSearch = {
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
  status: '',
  sourceType: '',
  carrier:'',
  teamedKey:'',
  ticketNumber:'',
  minTravelTime:'',
  maxTravelTime:'',
  resultType:'',
  departureAirport:'',
  arrivalAirport:''
}
const refundSearch = {
  shuttleNumber: '',
  orderId: '',
  id: '',
  operator: '',
  creator: '',
  minRLimit: '',
  maxRLimit: '',
  minTime: '',
  maxTime: '',
  sourceType: '',
  status: '',
  agentId:'',
  branchId:'',
  lockedBy:'',
  isLockedBy:'',
  carrier:'',
  bookingNumber:''
}
const changeSearch = {
  shuttleNumber: '',
  orderId: '',
  id: '',
  minTime: '',
  maxTime: '',
  minCLimit: '',
  maxCLimit: '',
  status: '',
  sourceType: '',
  carrier:'',
  ticketNumber:'',
  bookingNumber:''
}
const auxiliarySearch = {
  shuttleNumber: '',
    agentId:'',
    orderId: '',
    branchId:'',
    id: '',
    channelCode:'',
    operator: '',
    creator: '',
    minTime: '',
    maxTime: '',
    sourceType: '',
    status: '',
    lockedBy:'',
    isLockedBy:'',
    attachType:null,
    bookingNumber:''
}

const ListCard = memo(({listValue, getlogFnc, pathType, resetDataFnc}: {
  listValue: IOrderManual | IOrderRefund | IOrderChange | IOrderAuxiliary
  getlogFnc: (id: string) => void
  pathType:'ticket'|'refund'|'change'|'auxiliary'
  resetDataFnc: () => void
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
      navigate(`/orderDetail/${orderInfo?.id}`)
    }else{
      navigate(`/orderDetail/${orderInfo?.id}/${pathType}/${listValue.id}`)
    }
  }

  const locked = async (id: string, val: boolean, lockedBy: string | null) => {
    const runLockAction = async () => {
      let response
      switch (pathType){
        case "ticket":
          response = await changeOrderLockedByGroup(id, val);
          break
        case "refund":
          response = await changeRefundLockedByGroup(id, val);
          break
        case 'change':
          response = await changeChangeLockedByGroup(id, val);
          break
        case 'auxiliary':
          response = await changeAppendLockedByGroup(id, val);
          break
      }
      if(!response) return
      result(response);
      if (response.succeed) {
        resetDataFnc()
      }
    };

    if(lockedBy){
      const response = await Dialog.confirm({
        content: t('order.locakNameTips', { name: lockedBy }),
      })
      if(response){
        await runLockAction();
      }
    } else {
      await runLockAction();
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
                <CouponOutline color={'var(--active-color)'} fontSize={14} />
              </div>
              <Tag round
                   color={listValue.status === 'cancelled' ? 'danger' : 'primary'}>{statusShow}</Tag>
            </div>
          }
          extra={
            <Button size={'mini'} fill='none' onClick={() => locked(listValue.id,!!listValue.lockedBy ? false : true,listValue.lockedBy)}>
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
          <Space style={{ '--gap': '4px' }} direction='vertical' wrap className={'w-full'}>
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
  const navigate = useNavigate()
  const {orderType} = useParams()
  const {t} = useTranslation()
  const agentMap = useSelector(selectAgentMap)

  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const pageRef = useRef(1)

  const [keyword, setKeyword] = useState('')
  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [searchForm] = Form.useForm()

  const [searchFormData, setSearchFormData] = useState<IOrderManualSearchForm | IOrderRefundSearchForm | IOrderChangeSearchForm | IOrderAuxiliarySearchForm | null>(null)
  const [listValue, setListValue] = useState<(IOrderManual | IOrderRefund | IOrderChange | IOrderAuxiliary)[]>([])

  const pathType = useMemo(() => {
    if (
      orderType &&
      ['ticket', 'refund', 'change', 'auxiliary'].includes(orderType)
    ) {
      return orderType
    }

    return 'ticket'
  }, [orderType])

  const changeSegmented = (val: string | number) => {
    navigate(`/order/${String(val)}`)
  }

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
    // setLoading(reset)
    try {
      let response
      if(pathType === 'ticket'){
        response = await getOrdersListGroup({pageSize:20,page:nextPage},searchFormData as IOrderManualSearchForm)
      } else if(pathType === 'refund'){
        response = await getRefundsListGroup({pageSize:20,page:nextPage},searchFormData as IOrderRefundSearchForm)
      } else if(pathType === 'change'){
        response = await getChangesListGroup({pageSize:20,page:nextPage},searchFormData as IOrderChangeSearchForm)
      } else {
        response = await getAppendsListGroup({pageSize:20,page:nextPage},searchFormData as IOrderAuxiliarySearchForm)
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

  const onSearchFinish = (val) => {
    setSearchFormData(prevState => ({
      ...prevState,
      ...val,
    }))
    closeFilter()
  }

  const resetSearchFilter = () => {
    searchForm.resetFields()
    setKeyword('')
    switch (pathType){
      case 'ticket':
        setSearchFormData(ticketSearch as IOrderManualSearchForm)
        break
      case 'refund':
        setSearchFormData(refundSearch as IOrderRefundSearchForm)
        break
      case 'change':
        setSearchFormData(changeSearch as IOrderChangeSearchForm)
        break
      case 'auxiliary':
        setSearchFormData(auxiliarySearch as IOrderAuxiliarySearchForm)
        break
    }

    closeFilter()
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      id:val
    }) as IOrderManualSearchForm | IOrderRefundSearchForm | IOrderChangeSearchForm | IOrderAuxiliarySearchForm)
  }

  useEffect(() => {
    const changeData = () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth' // 或 'auto'
      });
      setLoading(true)
      resetData()
    }
    changeData()
  }, [pathType,searchFormData]);


  return (
    <section className={'containerMain'}>
      <div className={'w-full mb-2 bg-(--bg) sticky top-(--header-height) left-0 z-9'}>
        <Segmented block options={[
          {label: t('common.routerTicketing'), value: 'ticket'},
          {label: t('common.routerRefund'), value: 'refund'},
          {label: t('common.routerChange'), value: 'change'},
          {label: t('common.routerAuxiliary'), value: 'auxiliary'}
        ]} value={pathType} onChange={changeSegmented}/>
        <div className={'flex items-center py-2 px-2 bg-(--bg)'}>
          <SearchBar className={'flex-1'} placeholder={t('order.orderNo')}
                     style={{'--background': '#e8e9ed', '--border-radius': '20px'}} value={keyword} onChange={setKeyword}
                     onSearch={searchFilter} onClear={() => searchFilter('')}/>
          <Button fill='none' className={'!ml-2'} onClick={() => setVisiblePopSearch(true)}>
            <FilterOutline fontSize={18} color={'var(--active-color)'} />
          </Button>
        </div>
      </div>
      <div className="p-2">
        {
          !loading ? <>
              <PullToRefresh onRefresh={resetData}>
                {
                  listValue.length ? listValue.map(item => (
                    <ListCard key={item.id} listValue={item} getlogFnc={getlog} pathType={pathType} resetDataFnc={resetData} />
                  )) : <NoData />
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
        <Popup visible={visiblePopSearch} position='right' onMaskClick={closeFilter}
               bodyStyle={{width: '80vw', backgroundColor: 'var(--bg)'}}>
          <Form form={searchForm} mode={'card'} onFinish={onSearchFinish} footer={
            <Grid columns={2} gap={8}>
              <Grid.Item>
                <Button block size='small' onClick={resetSearchFilter}>
                  {t('group.reset')}
                </Button>
              </Grid.Item>
              <Grid.Item>
                <Button block type='submit' color='primary' size='small'>
                  {t('common.search')}
                </Button>
              </Grid.Item>
            </Grid>
          }>
            <Form.Item label={t('foundation.agent')} name={'agentId'}>
              <AgentSearch />
            </Form.Item>
            <Form.Item label={t('order.ticketNumber')} name={'ticketNumber'}>
              <Input placeholder={t('order.ticketNumber')} />
            </Form.Item>
            {
              pathType === 'ticket' &&
                <Form.Item label={t('group.bookingNumber')} name={'bookingNumber'}>
                    <Input placeholder={t('group.bookingNumber')} />
                </Form.Item>
            }

            <Form.Item label={t('order.orderStatus')} name={'status'}>
              <Radio.Group>
                <Space direction='vertical' wrap>
                  <Radio value={''}>{t('common.routerTicketingAll')}</Radio>
                  {
                    Object.entries(statusMap[pathType]).map(([key, value]) => (
                      <Radio key={key} value={key}>{t('common.'+value)}</Radio>
                    ))
                  }
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </Popup>
      </div>
    </section>
  )
}
