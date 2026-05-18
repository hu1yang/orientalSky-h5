import {type ReactNode, useEffect, useMemo, useState} from "react";
import {useSelector} from "react-redux";
import {selectAgentMap} from "@/store/modules/base.ts";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {Badge, Button, Divider, PullToRefresh, Segmented, SpinLoading, Tag} from "antd-mobile";

import {useDetailData} from "@/context/order/detailContext.tsx";
import DetailListProvider from "@/context/order/detailProvider.tsx";

import {copyText} from "@/utils/public.ts";
import {calculateTotalPriceByPassengers} from "@/utils/order.tsx";
import {
  getAppendInfosGroup,
  getChangeInfosGroup,
  getOrderInfoGroup,
  getRefundInfosGroup
} from "@/utils/request/group.ts";

import AmountCard from "@/component/order/detail/amountCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import RefundDetail from "@/component/order/detail/refundDetail.tsx";
import ChangeDetail from "@/component/order/detail/changeDetail.tsx";
import AuxiliaryDetail from "@/component/order/detail/auxiliaryDetail.tsx";
import NoData from "@/component/default/noData.tsx";


const badgeStyle = {
  '--right': '120%',
  '--top': '50%',
  width:'5px',
  height:'5px',
  minWidth:'5px'
} as React.CSSProperties

function DetailInfo(){
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true)
  const [loadingCom, setLoadingCom] = useState(true)
  const {orderId,status} = useParams()
  const agentMap = useSelector(selectAgentMap)

  const tabs = [
    {
      value: 'detail',
      label: t('order.orderDetail'),
    },
    {
      value: 'refund',
      label: t('order.refundDetail'),
    },
    {
      value: 'change',
      label: t('order.changeDetail'),
    },
    {
      value: 'auxiliary',
      label: t('order.auxiliaryDetail'),
    },
  ]

  const [activeStatus, setActiveStatus] = useState(tabs.map(a => a.value).includes(status ?? '') ? status! : 'detail')

  const {
    orderDetail,
    setOrderDetail,
    auxiliaryList,
    setAuxiliaryList,
    changeList,
    setChangeList,
    refundList,
    setRefundList
  } = useDetailData()


  const computedOrderItineraries = useMemo(() => {
    if (!orderDetail?.itineraries) return [];

    return orderDetail.itineraries
      .slice() // 避免修改原始数组
      .sort((a, b) => (a.itineraryNo as number) - (b.itineraryNo as number))
      .map(itinerary => ({
        ...itinerary,
        segments: itinerary.segments?.slice().sort((a, b) => (a.sequenceNo as number) - (b.sequenceNo as number)) || [],
      }));
  },[orderDetail])

  const totalPrice = useMemo(() => {
    if (
      !orderDetail?.passengers?.length ||
      !computedOrderItineraries.length
    ) {
      return ''
    }
    return calculateTotalPriceByPassengers(orderDetail.passengers,computedOrderItineraries.flatMap(it => it.amounts)).toFixed(2)
  },[orderDetail,computedOrderItineraries])

  const changeTab = (tab:string | number,id:string) => {
    setLoadingCom(true)
    setActiveStatus(String(tab))

    switch (tab){
      case 'refund':
        getRefund(id)
        break
      case 'change':
        getChange(id)
        break
      case 'auxiliary':
        getAuxiliary(id)
        break
    }
  }

  const getRefund = (id:string) => {
    getRefundInfosGroup(id).then(res => {
      if(res.length){
        setRefundList(res)
        setLoadingCom(false)
      }
    })
  }

  const getChange = (id:string) => {
    getChangeInfosGroup(id).then(res => {
      if(res.length){
        setChangeList(res)
        setLoadingCom(false)
      }
    })
  }

  const getAuxiliary = (id:string) => {
    getAppendInfosGroup(id).then(res => {
      if(res.length){
        setAuxiliaryList(res)
        setLoadingCom(false)
      }
    })
  }

  const detailMap:Record<'detail'|'refund'|'change'|'auxiliary', ReactNode> = {
    detail: <>
      <PassengerCard passengers={orderDetail?.passengers ?? []} />
      <AmountCard itineraryList={computedOrderItineraries} travelers={orderDetail?.request.travelers ?? []} currency={orderDetail?.currency || ''} totalPrice={totalPrice} policies={orderDetail?.policies ?? []} />
      <SegmentCard itineraryList={computedOrderItineraries} />
    </>,
    refund: loadingCom ? <SpinLoading color='primary' /> : <RefundDetail refundList={refundList} passengers={orderDetail?.passengers ?? []} itineraries={computedOrderItineraries} />,
    change: loadingCom ? <SpinLoading color='primary' /> :  <ChangeDetail changeList={changeList} passengers={orderDetail?.passengers ?? []} itineraries={computedOrderItineraries} />,
    auxiliary: loadingCom ? <SpinLoading color='primary' /> : <AuxiliaryDetail auxiliaryList={auxiliaryList} passengers={orderDetail?.passengers ?? []} itineraries={computedOrderItineraries} />,

  }

  const getData = async () => {
    try {
      const response = await getOrderInfoGroup(orderId as string)
      const info = agentMap.get(response.agentId)
      setOrderDetail({
        ...response,
        ...info
      })
      changeTab(activeStatus,response.id)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <PullToRefresh onRefresh={getData}>
      {
        loading ?
          <SpinLoading color='primary' />
          :
          (
            orderDetail ? (
                <>
                  <div className={'flex justify-between items-center mb-5'}>
                    <div className={'flex items-center'}>
                      <Tag round color={orderDetail.resultType === 'normal' ? 'var(--success-color)':'var(--warning-color)'}>
                        {t('order.'+ orderDetail.resultType)}
                      </Tag>
                      <div className={'ml-2 flex items-center'}>
                        <p className={'text-(--warning-color) text-[1rem] leading-none'}>{orderDetail.id}</p>
                        <Button fill='none' size={'mini'} onClick={() => copyText(orderDetail.id)} style={{padding: '0 4px'}}>
                          <i className={'iconfont icon-copy !text-[1rem] text-(--warning-color)'}></i>
                        </Button>
                      </div>
                    </div>
                    <span className={'text-(--text) text-[1rem]'}>{orderDetail.branchCode}-{orderDetail.agentCode}</span>
                  </div>
                  <div className={'flex flex-row items-center mb-5'}>
                    <div className={'flex flex-col'}>
                      <span className={'text-[1rem] text-(--text)'}>TOTAL</span>
                      <div className={'leading-none'}>
                        <span className={'font-bold text-[3rem] text-(--price-color)'}>{totalPrice}</span>
                        <span className={'text-[1rem] text-(--text) ml-1'}>{orderDetail.currency}</span>
                      </div>
                    </div>
                    <Divider direction='vertical' style={{
                      borderColor: 'var(--border)',
                      height: 40,
                    }} />
                    <div className={'flex flex-col'}>
                      <span className={'text-[1rem] text-(--text)'}>{t('order.orderStatus')}</span>
                      <div>
                        <Badge color='#108ee9' content={Badge.dot}
                               style={badgeStyle}>
                        </Badge>
                        <span className={'ml-2'}>{orderDetail.status}</span>
                      </div>
                    </div>
                  </div>
                  <Segmented options={tabs} block className={'mb-5'} onChange={(val) => changeTab(val,orderDetail?.id)} value={activeStatus} />
                  {
                    detailMap[activeStatus as 'detail'|'refund'|'change'|'auxiliary']
                  }
                </>
              ):
              <NoData />
          )
      }

    </PullToRefresh>
  )
}

export default function OrderDetail(){
  return (
    <section className={'container'}>
      <div className={'w-full pt-2 px-1'}>
        <DetailListProvider>
          <DetailInfo />
        </DetailListProvider>
      </div>
    </section>

  )
}
