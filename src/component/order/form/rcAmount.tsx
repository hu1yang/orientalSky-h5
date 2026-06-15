import React, {forwardRef, memo, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDetailData} from "@/context/order/detailContext.tsx";

import {
  Button, Card, Dialog, Divider,
  Form,
  Input, List,
  Popup,
  Radio,
  Segmented,
  Space,
  Swiper,
  type SwiperRef,
  Tag,
  TextArea, Toast
} from "antd-mobile";


import type {
  AmountRC,
  BookingOrder,
  IPolicies,
  ITravelerType,
  Passenger,
  PurchaseRefund,
  UpOrderRCAmounts
} from "@/types/order.ts";
import {
  bookingRefundGroup,
  getBookingOrdersGroup, getExchangeRateGroup, getFeessSettingGroup, paymentRefundGroup,
  refundConsultGroup,
  upsertChangeAmountsGroup,
  upsertRefundAmountsGroup
} from "@/utils/request/group.ts";
import {result} from "@/utils/public.ts";
import CardText from "@/component/card/cardText.tsx";
import {calculateTotalPriceByPassengers} from "@/utils/order.ts";
import {statusBookingTicket} from "@/utils/common.ts";




export default memo(forwardRef(function RCAmount({resetDetailFnc,type}: {
  resetDetailFnc: () => void
  type: 'change'|'refund'
}, ref) {
  const {t} = useTranslation()

  const tabItems = [
    {value: 'pricing',label: type === 'refund' ? t('order.refundPrice'):t('order.changePrice')},
    {value: 'quote',label: t('order.refundInquiryBtn')}
  ]

  const {
    orderDetail,
    refundList
  } = useDetailData()

  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const swiperRef = useRef<SwiperRef>(null)
  const [activeIndex, setActiveIndex] = useState(0)

  const [detailId, setDetailId] = useState('')

  const [bookingList, setBookingList] = useState<BookingOrder[]>([])
  const [bookingId, setBookingId] = useState<string>('')
  const [purchaseLoading, setPurchaseLoading] = useState(false)
  const [purchaseObj, setPurchaseObj] = useState<PurchaseRefund|null>(null)
  const [purchaseInquiryInfo, setPurchaseInquiryInfo] = useState<{
    currency:string
    amounts:AmountRC[]
  }|null>(null)

  const [airRefundPirce, setAirRefundPirce] = useState<string|number>(0)
  const [ticketingProfit, setTicketingProfit] = useState<string|number>(0)
  const [refundFeesAmount, setRefundFeesAmount] = useState<string|number>(0)

  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      openSurePop: sureAmount
    }
  })

  const detailInfo = useMemo(() => {
    if (type === 'refund'){
      return refundList.find(refund => refund.id === detailId);
    }
  },[refundList,detailId,type])

  const policiesArr = useMemo(() => {
    const familyMap = new Map(
      orderDetail?.itineraries.flatMap(itinerarie =>
        itinerarie.amounts.map(amount => {
          const count = orderDetail?.passengers.filter(
            p => p.passengerType === amount.passengerType
          ).length
          return [amount.familyCode, { passengerType: amount.passengerType, count }]
        })
      )
    )

    const newPolicie: (IPolicies & {
      count:number
      passengerType: ITravelerType
    })[] = []
    let total = 0

    for (const policie of orderDetail?.policies ?? []) {
      const family = familyMap.get(policie.familyCode)
      if (!family) continue

      newPolicie.push({
        ...policie,
        count: family.count,
        passengerType:family.passengerType as ITravelerType
      })

      total += Number(policie.discount || 0) * family.count
    }
    return {
      policies:newPolicie,
      total
    }
  }, [orderDetail]);

  const totalPrice = useMemo(() => {
    if (
      !orderDetail?.passengers?.length ||
      !orderDetail?.itineraries.length
    ) {
      return ''
    }
    return calculateTotalPriceByPassengers(orderDetail.passengers,orderDetail?.itineraries.flatMap(it => it.amounts)).toFixed(2)
  },[orderDetail])

  const sureAmount = (passengers: Passenger[],id: string) => {
    setDetailId(id)
    setVisiblePop(true)
    const info = refundList.find(refund => refund.id === id);
    if(info?.status === 'executed'){
      form.setFieldsValue({
        id:id,
        remarks:info.confirmed?.remarks || '',
        sureNow: true,
        amounts: info.confirmed?.amounts.map(a => ({
          ...a,
          othersNotes:(a.othersNotes as string[]).join('\n') || ''
        }))
      })
    }else{
      const newAmounts = passengers.map(passenger => ({
        fullName: passenger.fullName,
        idNumber: passenger.idNumber,
        deductionAmount: '0',
        netServiceFees: '0',
      }))
      form.setFieldsValue({
        id:id,
        remarks: '',
        sureNow: true,
        amounts: newAmounts,
      })
    }

    setTicketingProfit(Number(policiesArr.total * -1))
    if(type === 'refund'){
      getAgentInfo()
      getBooking()
    }
  }

  const getAgentInfo = () => {
    getFeessSettingGroup(orderDetail?.agentId as string).then(res => {
      if(res && Object.keys(res).length){
        setRefundFeesAmount(Number(res.refundFeesAmount || 0))
      }
    })
  }

  const getBooking = () => {
    getBookingOrdersGroup(orderDetail?.id as string).then(res => {
      setBookingList(res)
    })
  }

  const chooseBooking = () => {
    Dialog.show({
      content: t('order.purchaseOrderNumber'),
      closeOnAction: true,
      closeOnMaskClick: true,
      actions: bookingList.map(a => ({
        key: a.id,
        text: `${a.id}(${t('common.'+ statusBookingTicket[bookingInfo?.status || 'created'])})`,
        onClick:() => {
          setBookingId(a.id);
        }
      }))
    })
  }

  useEffect(() => {
    if(bookingList.length && detailInfo){
      changeBooking(bookingList[0])
    }
  }, [bookingList,detailInfo]);

  const changeBooking = (data: BookingOrder) => {
    setBookingId(data.id);

    const refundPassengerIds = new Set(
      detailInfo?.refundForPassengers.map(item => item.subPassengerId)
    );

    const itineraryMap = new Map(
      detailInfo?.refundForItineraries.map(item => [
        item.subItineraryId,
        item.flightNumbers,
      ])
    );

    const hasPassengerIds = data.hasPassengers
      .filter(item => refundPassengerIds.has(item.subPassengerId))
      .map(item => item.id);

    const hasItineraries = data.hasItineraries
      .filter(item => itineraryMap.has(item.subItineraryId))
      .map(item => ({
        hasItineraryId: item.id,
        flightNumbers: itineraryMap.get(item.subItineraryId) ?? [],
      }));

    setPurchaseObj({
      isVoluntary:detailInfo?.isVoluntary || true,
      hasPassengerIds,
      hasItineraries,
    })
  };

  const bookingInfo = useMemo(() => {
    return bookingList.find(bk => bk.id === bookingId)
  },[bookingList,bookingId])


  const onFinish = async (val: UpOrderRCAmounts) => {
    setLoadingBtn(true)
    try {
      const formData = {
        ...val,
        amounts: val.amounts.map(amount => ({
          ...amount,
          othersNotes:amount.othersNotes ? (amount.othersNotes as string).split('\n'): []
        })),
        changeId: form.getFieldValue('id'),
        refundId: form.getFieldValue('id')
      }
      let response
      if(type === 'change'){
        response = await upsertChangeAmountsGroup(formData, formData.sureNow as boolean)
      }else{
        response = await upsertRefundAmountsGroup(formData, formData.sureNow as boolean)
      }
      if(response){
        result(response)
        if (response.succeed) {
          closePop()
          resetDetailFnc()
        }
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const closePop = () => {
    swiperRef.current?.swipeTo(0)
    setVisiblePop(false)
    form.resetFields()
    setLoadingBtn(false)
    setPurchaseLoading(false)
    setActiveIndex(0)
    setDetailId('')
    setBookingList([])
    setBookingId('')
    setPurchaseObj(null)
    setPurchaseInquiryInfo(null)
    setAirRefundPirce(0)
    setTicketingProfit(0)
    setRefundFeesAmount(0)
  }

  const rechargePrice = (price: number , rechargeRate:number = 1) => {
    const accountRate = Number(orderDetail?.exchangeRate) || 1;
    if (!price) return 0;
    const result = price * (accountRate / rechargeRate);
    return Math.round(result * 100) / 100;
  };

  const refundSummary = useMemo(() => {
    const resultRefundC = Number(airRefundPirce)
    const usdExchange = orderDetail?.exchangeRate
    const ticketingProfitC = rechargePrice(Number(ticketingProfit || 0),usdExchange)
    const serviceFeeC = rechargePrice(Number(refundFeesAmount ?? 0),usdExchange)

    const result = Number((resultRefundC - ticketingProfitC - serviceFeeC).toFixed(2))

    return result
  },[airRefundPirce,ticketingProfit,refundFeesAmount,orderDetail?.exchangeRate])

  const refundInquiry = async () => {
    setPurchaseLoading(true)
    try {
      const response = await refundConsultGroup(bookingId,purchaseObj as PurchaseRefund)
      if(response.succeed){
        setPurchaseInquiryInfo(response.content)
        Toast.show({
          icon: 'success',
          content: t('order.refundInquiry'),
        })
        let currencyExchange = orderDetail?.exchangeRate
        if(response.content.currency !== orderDetail?.currency){
          currencyExchange = await getExchange(response.content.currency)
        }
        const airRefundResult = rechargePrice(response.content.amounts.reduce((total, item) => total + Number(item.netRefundAmount), 0),currencyExchange)
        setAirRefundPirce(airRefundResult)
      }else{
        Toast.show({
          icon: 'fail',
          content: response.message,
        })
      }
    } finally {
      setPurchaseLoading(false)
    }
  }

  const implementRefund = async () => {
    Dialog.confirm({
      content: t('order.purchaseRefundTips'),
      onConfirm: async () => {
        setPurchaseLoading(true)
        try {
          const response= await bookingRefundGroup(bookingId,purchaseObj as PurchaseRefund)
          if(response){
            result(response)
          }
        } finally {
          setPurchaseLoading(false)
        }
      }
    })
  }

  const getExchange = async (value:string) => {
    const response = await getExchangeRateGroup(value)
    return Object.keys(response).length ? response.cashSellingRate : 0
  }

  const executeAmount = () => {
    const total = detailInfo?.confirmed?.amounts.reduce((sum, amount) => {
      const netRefundAmount = Number(amount.netRefundAmount) || 0
      return sum + netRefundAmount;
    }, 0);

    const totalPrice = Math.round((total || 0) * 100) / 100; // 最终总价再处理一遍

    const message = t('order.refundTips', { tc:`${totalPrice}${detailInfo?.confirmed?.currency}` })

    Dialog.confirm({
      content: message,
      onConfirm: async () => {
        const resposne = await paymentRefundGroup(detailId)
        result(resposne)
        if(resposne.succeed){
          closePop()
          resetDetailFnc()
        }else{
          throw new Error()
        }
      }
    })
  }

  return (
    <Popup visible={visiblePop} position='right' showCloseButton onClose={closePop}
           bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
      <div className={'pt-0 h-full flex flex-col'}>
        <div className={'h-[40px] text-center leading-[40px]'}>
          <span className={'text-[1.4rem] font-bold '}>{t('order.'+type)}</span>
        </div>
        {
          type === 'refund' && (
            <Segmented options={tabItems} block className={'mb-0'} onChange={ key => {
              const index = tabItems.findIndex(item => item.value === key)
              setActiveIndex(index)
              swiperRef.current?.swipeTo(index)
            }}
                       value={tabItems[activeIndex].value} />
          )
        }
        <Swiper direction='horizontal'
                indicator={() => null}
                ref={swiperRef}
                defaultIndex={activeIndex}
                onIndexChange={index => {
                  setActiveIndex(index)
                }}>
          <Swiper.Item>
            <div className={'overflow-auto h-full'}>
              <Form form={form} mode='card' onFinish={onFinish}
                    disabled={detailInfo?.status === 'executed'}
                    footer={
                      <Space direction='vertical' block>
                        {
                          detailInfo?.status === 'executed' && (
                            <Button block size='middle' style={{
                              '--background-color':'var(--warning-color)'
                            }} onClick={executeAmount}>
                              {t('order.executeRefundEd')}
                            </Button>
                          )
                        }
                        <Button block type='submit' color='primary' size='middle' disabled={detailInfo?.status === 'executed'} loading={loadingBtn}>
                          {t('common.submit')}
                        </Button>
                      </Space>
                    }>
                <Form.Array name={'amounts'}>
                  {
                    fields => fields.map(({index}) => (
                      <>
                        <Form.Item name={[index, 'fullName']} label={t('order.travelerName')}>
                          <Input placeholder={t('order.travelerName')} disabled/>
                        </Form.Item>
                        <Form.Item name={[index, 'idNumber']} label={t('order.travelerIdNo')}>
                          <Input placeholder={t('order.travelerName')} disabled/>
                        </Form.Item>
                        <Form.Item name={[index, 'netServiceFees']} label={t('order.netServiceFees')} rules={[
                          {required: true, message: t('order.netServiceFees')},
                        ]}>
                          <Input placeholder={t('order.netServiceFees')} type={'number'}/>
                        </Form.Item>
                        <Form.Item name={[index, 'deductionAmount']} label={t('order.deductionAmount')} rules={[
                          {required: true, message: t('order.deductionAmount')},
                        ]}>
                          <Input placeholder={t('order.deductionAmount')} type={'number'}/>
                        </Form.Item>
                        {
                          type === 'change'?
                            <Form.Item name={[index, 'netChangeAmount']} label={t('order.netChangeAmount')} rules={[
                              {required: true, message: t('order.netChangeAmount')},
                            ]}>
                              <Input placeholder={t('order.netChangeAmount')} type={'number'}/>
                            </Form.Item>
                            :
                            <Form.Item name={[index, 'netRefundAmount']} label={t('order.netRefundAmount')} rules={[
                              {required: true, message: t('order.netRefundAmount')},
                            ]}>
                              <Input placeholder={t('order.netRefundAmount')} type={'number'}/>
                            </Form.Item>
                        }

                        <Form.Item name={[index, 'othersNotes']} label={t('foundation.othersNotes')}>
                          <TextArea
                            placeholder={t('foundation.othersNotes')}
                            maxLength={100}
                            rows={2}
                            showCount
                          />
                        </Form.Item>
                      </>
                    ))
                  }
                </Form.Array>
                <Form.Item name={'remarks'} label={t('base.remarks')}>
                  <TextArea
                    placeholder={t('base.remarks')}
                    maxLength={100}
                    rows={2}
                    showCount
                  />
                </Form.Item>
                <Form.Item name={'sureNow'} label={t('order.sureNow')}>
                  <Radio.Group>
                    <Space>
                      <Radio value={true}>true</Radio>
                      <Radio value={false}>false</Radio>
                    </Space>
                  </Radio.Group>
                </Form.Item>
              </Form>
            </div>
          </Swiper.Item>
          {
            type === 'refund' ? (
              <Swiper.Item>
                <div className={'w-full px-[12px]'}>
                  <div className={'w-full flex justify-between items-center my-5'} onClick={chooseBooking}>
                    <div>
                      <span className={'text-[1rem] text-(--text)'}>{t('order.purchaseOrderNumber')}</span>
                      <p className={'text-[1.2rem] text-(--text-h)'}>{bookingInfo?.id}</p>
                    </div>
                    <div>
                      <Space>
                        <Tag color={'success'}>{t('common.'+ statusBookingTicket[bookingInfo?.status || 'created'])}</Tag>
                        <Tag color={'primary'}>{t('order.voluntary')} · {t('common.'+purchaseObj?.isVoluntary)}</Tag>
                      </Space>
                    </div>
                  </div>
                  <div className={'mb-5'}>
                    <div className={'mb-2'}>
                      <span className={'text-[1.1rem] text-(--text)'}>{t('order.refundConfirmed')}</span>
                    </div>
                    <List mode='card' style={{
                      margin: 0,
                    }}>
                      <List.Item title={t('order.orderAmount')} extra={<Tag className={'text-[1.2rem]!'} style={{
                        padding: '5px 8px',
                        '--border-radius': 'var(--rounder-radius)',
                        '--border-color':'rgba(0, 181, 120, 0.1)',
                        '--background-color': 'rgba(0, 181, 120, 0.1)',
                        '--text-color': '#00b578'
                      }}>{totalPrice}/{orderDetail?.currency}</Tag>}/>
                      {
                        purchaseInquiryInfo?.amounts.map((amount,amountIndex) => (
                          <React.Fragment key={amountIndex}>
                            <List.Item title={t('order.netServiceFees')} extra={`${amount.netServiceFees}/${purchaseInquiryInfo?.currency}`}/>
                            <List.Item title={t('order.deductionAmount')} extra={`${amount.deductionAmount}/${purchaseInquiryInfo?.currency}`}/>
                            <List.Item title={<span className={'font-bold text-[1.2rem] text-(--text-h)'}>{t('order.netRefundAmount')}</span>} className={'bg-[#ff314108]!'} description={`${amount.fullName || ''}${amount.idNumber || ''}`} extra={<Tag className={'text-[1.2rem]!'} style={{
                              padding: '5px 8px',
                              '--border-radius': 'var(--rounder-radius)',
                              '--border-color':'rgba(255, 49, 65, 0.08)',
                              '--background-color': 'rgba(255, 49, 65, 0.08)',
                              '--text-color': '#ff3141'
                            }}>{amount.netRefundAmount}/{purchaseInquiryInfo?.currency}</Tag>}/>
                            <List.Item title={t('foundation.othersNotes')} description={(amount.othersNotes as string[]).join('\n') || '--'}/>
                          </React.Fragment>
                        ))
                      }
                    </List>
                  </div>
                  {
                    !!policiesArr.policies.length && (
                      <div className={'mb-5'}>
                        <div className={'mb-2'}>
                          <span className={'text-[1.1rem] text-(--text)'}>{t('common.teamdPatterns')}</span>
                        </div>
                        <Space>
                          {
                            policiesArr.policies.map(policie => (
                              <Tag className={'text-[1.2rem]!'} key={policie.id} style={{
                                padding: '5px 8px',
                                '--border-radius': 'var(--rounder-radius)',
                                '--border-color':'rgba(22, 119, 255, 0.08)',
                                '--background-color': 'rgba(22, 119, 255, 0.08)',
                                '--text-color': '#1677ff'
                              }}>{t('order.'+policie.passengerType)} {policie.discount} × {policie.count}</Tag>
                            ))
                          }
                        </Space>
                      </div>
                    )
                  }
                  <div className={'mb-5'}>
                    <Card>
                      <CardText label={t('order.airlineRefundAmount')} style={'mb-4'} value={
                        <div className={'w-full bg-(--bg) px-[10px] py-[5px] flex items-baseline rounded-(--rounder-radius) min-h-[24px]'}>
                          <input value={airRefundPirce} onChange={(e) => setAirRefundPirce(e.target?.value)} type="number" className={'w-full outline-0 bg-transparent border-0 text-right mr-2 min-h-[1.5em] leading-1.5 text-[1.3rem]'} />
                          <span className={'text-(--text) text-[1rem]'}>{orderDetail?.currency}</span>
                        </div>
                      }/>
                      <CardText label={t('order.ticketingProfit')} style={'mb-4'} value={
                        <div className={'w-full bg-(--bg) px-[10px] py-[5px] flex items-baseline rounded-(--rounder-radius) min-h-[24px]'}>
                          <input value={ticketingProfit} onChange={(e) => setTicketingProfit(e.target?.value)} type="number" className={'w-full outline-0 bg-transparent border-0 text-right mr-2 min-h-[1.5em] leading-1.5 text-[1.3rem]'} />
                          <span className={'text-(--text) text-[1rem]'}>USD</span>
                        </div>
                      }/>
                      <CardText label={t('order.serviceFee')} style={'mb-4'} value={
                        <div className={'w-full bg-(--bg) px-[10px] py-[5px] flex items-baseline rounded-(--rounder-radius) min-h-[24px]'}>
                          <input value={refundFeesAmount} onChange={(e) => setRefundFeesAmount(e.target?.value)} type="number" className={'w-full outline-0 bg-transparent border-0 text-right mr-2 min-h-[1.5em] leading-1.5 text-[1.3rem]'} />
                          <span className={'text-(--text) text-[1rem]'}>USD</span>
                        </div>
                      }/>
                      <Divider className={'border-dashed!'} />
                      <CardText style={'mb-4'} labelStyle={'font-bold! text-[1.3rem]! text-(--text-h)'} valueStyle={'text-right'} value={
                        <Tag className={'text-[1.8rem]!'} style={{
                          padding: '8px 20px',
                          '--border-radius': 'var(--rounder-radius)',
                          '--border-color':'rgba(255, 143, 31, 0.1)',
                          '--background-color': 'rgba(255, 143, 31, 0.1)',
                          '--text-color': '#ff8f1f',
                          fontWeight: 'bold'
                        }}>{refundSummary}<span className={'text-[1rem] ml-2 font-normal'}>{orderDetail?.currency}</span></Tag>
                      }/>
                    </Card>
                  </div>
                  {
                    purchaseInquiryInfo ?
                      <Button block color={"danger"} size='middle' onClick={implementRefund} loading={purchaseLoading}>{t('order.sureRefundFnc')}</Button>
                      :
                      <Button block color={"warning"} size='middle' onClick={refundInquiry} loading={purchaseLoading}>{t('order.refundInquiryBtn')}</Button>
                  }
                </div>
              </Swiper.Item>
            ):<></>
          }
        </Swiper>
      </div>
    </Popup>
  )
}))
