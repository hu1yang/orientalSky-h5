import {forwardRef, memo, useCallback, useImperativeHandle, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import {
  Button,
  Card, Checkbox, Dialog,
  Form,
  Input,
  Popup,
  Segmented, Space,
  Swiper,
  type SwiperRef,
  Tag,
  TextArea, Toast
} from "antd-mobile";
import type {
  AppendConsultForm,
  AppendResult,
  BookingOrder,
  ISeekType,
  UpOrderAppendAmounts
} from "@/types/order.ts";
import {
  appendConsultGroup,
  bookingAppendGroup,
  getBookingOrdersGroup, setAppendAttachedGroup,
  upsertAppendAmountsGroup
} from "@/utils/request/group.ts";
import {passengerTypes, result} from "@/utils/public.ts";
import {useDetailData} from "@/context/order/detailContext.tsx";
import {statusBookingTicket} from "@/utils/common.ts";

interface ICurrentValue {
  flightNumbers: string[]
  passengerNames: string[]
  result:AppendResult|null
}

const ComboCard = memo(({auData,currency,currentValue,chooseOptionsFnc}:{
  auData: AppendResult
  currency: string
  currentValue: {
    flightNumbers: string[]
    passengerNames: string[]
    result:AppendResult|null
  } | null
  chooseOptionsFnc: (value: ICurrentValue|null) => void
}) =>{

  const checkValueAll = useMemo(() => {
    const passengerEqual =
      auData.passengerNames.length === currentValue?.passengerNames.length &&
      auData.passengerNames.every(name =>
        currentValue?.passengerNames.includes(name)
      )

    const flightEqual =
      auData.flightNumbers.length === currentValue?.flightNumbers.length &&
      auData.flightNumbers.every(no =>
        currentValue?.flightNumbers.includes(no)
      )

    return passengerEqual && flightEqual
  }, [currentValue, auData])

  const checkAllFnc = () => {
    if(!checkValueAll){
      chooseOptions({
        result:auData,
        passengerNames: auData.passengerNames,
        flightNumbers: auData.flightNumbers
      })
    }else{
      chooseOptions(null)
    }
  }

  const chooseOptions = (value: ICurrentValue|null) => {
    chooseOptionsFnc(value)
  }

  const totalPrice = useMemo(() => {
    const detail = currentValue
    if (!detail) return 0

    return (
      detail.flightNumbers.length *
      detail.passengerNames.length *
      auData.perPaymentAmount
    ) || 0
  },[currentValue, auData])

  return (
    <Card className={`mb-4 relative`} onClick={checkAllFnc} style={{
      '--adm-color-primary':'var(--warning-color)',
      '--adm-color-background': checkValueAll ? 'rgb(230 162 60/10%)' : '#ffffff',
      '--font-color': checkValueAll ? 'var(--warning-color)' : 'var(--text-h)',
      '--text-color': checkValueAll ? 'var(--warning-color)' : 'var(--text)',
      '--adm-color-check': checkValueAll ? 'rgb(230 162 60/10%)' : '#f5f5f5',
      border: checkValueAll ? '2px solid var(--adm-color-primary)':'2px solid transparent'
    }}>
      <div className={'flex flex-row'}>
        <div className={'mr-4'}>
          <Checkbox checked={checkValueAll} style={{'--icon-size': '20px'}} />
        </div>
        <div className={'flex-1 flex flex-col'}>
          <div className={'flex flex-col'}>
            <h2 className={'text-[1.4rem]! text-(--font-color)!'}>{auData.resultName}</h2>
            <span className={'text-[1rem] text-(--text)'}>{auData.resultType} · package</span>
          </div>
          <div className={'mt-4'}>
            <Space style={{ '--gap': '10px' }}>
              <Checkbox.Group value={currentValue?.flightNumbers ?? []} onChange={(value) => {
                chooseOptions({
                  result:auData,
                  passengerNames: currentValue?currentValue.passengerNames:[],
                  flightNumbers: value as string[]
                })
              }}>
                <Space wrap style={{ '--gap': '10px' }}>
                  {
                    auData.flightNumbers.map(flightNumber => (
                      <Checkbox onClick={e => e.stopPropagation()}
                                className={`px-4 py-2 text-(--text-color) block rounded-lg ${currentValue?.flightNumbers.includes(flightNumber) ? 'bg-[#ff8f1f1f]' : 'bg-[#f5f5f5]'}`}
                                style={{'--icon-size': '18px', '--font-size': '14px'}}
                                value={flightNumber}>{flightNumber}</Checkbox>
                    ))
                  }
                </Space>
              </Checkbox.Group>
              <Checkbox.Group value={currentValue?.passengerNames ?? []} onChange={(value) => {
                chooseOptions({
                  result:auData,
                  flightNumbers: currentValue?currentValue.flightNumbers:[],
                  passengerNames: value as string[]
                })
              }}>
                <Space wrap style={{ '--gap': '10px' }}>
                  {
                    auData.passengerNames.map(passengerName => (
                      <Checkbox
                        className={`px-4 py-2 text-(--text-color) block rounded-lg ${currentValue?.passengerNames.includes(passengerName) ? 'bg-[#ff8f1f1f]' : 'bg-[#f5f5f5]'}`}
                        onClick={e => e.stopPropagation()} style={{'--icon-size': '18px', '--font-size': '14px'}}
                        value={passengerName}>{passengerName}</Checkbox>
                    ))
                  }
                </Space>
              </Checkbox.Group>
            </Space>
          </div>
        </div>
        <div className={'flex flex-col justify-between w-32 text-right'}>
          <div>
            <span className={'text-(--text) text-[1rem]'}>Unit price</span>
            <p className={'text-(--text-h) text-[1.8rem] font-bold'}>{auData.perPaymentAmount}</p>
          </div>
          <div className={'text-[1rem] text-(--text) text-(--text-color)!'}>
            <span><span className={'text-[1.4rem] font-bold'}>{totalPrice}</span> / {currency}</span>
          </div>
        </div>
      </div>
    </Card>
  )
})

const PassengerCard = memo(({passengerName}:{
  passengerName: string
}) => {
  const {t} = useTranslation()

  const {
    orderDetail,
  } = useDetailData()

  const passenger = useMemo(() => orderDetail?.passengers.find(p => p.fullName === passengerName),[orderDetail,passengerName])

  if(!passenger) return <></>

  return (
    <>
      <span className={'text-(--text) mb-1'}>{passenger.idNumber || '--'} · {passenger.birthday || '-'}</span>
      <span className={'text-(--text) mb-1'}>{t('order.passenger')} <span
        className={'text-[1.1rem] text-(--active-color)'}>{passenger?.fullName} ({t('order.' + passengerTypes[passenger.passengerType as 'adt' | 'chd' | 'inf'].toLocaleLowerCase())})</span> · {passenger.ticketNumbers.map(ticketNumber => `${ticketNumber.ticketNumber}(${ticketNumber.bookingNumber})`)}</span>
    </>
  )
})

export default memo(forwardRef(function AuxiliaryAmount({resetDetailFnc}:{
  resetDetailFnc: () => void
},ref){
  const {t} = useTranslation()

  const tabItems = [
    {value: 'pricing',label: t('order.auxiliaryPrice')},
    {value: 'quote',label: t('order.auxiliaryInquiry')}
  ]

  const {
    auxiliaryList,
    orderDetail
  } = useDetailData()

  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const [auxiliaryInquiryList, setAuxiliaryInquiryList] = useState<AppendResult[]>([])
  const [auxiliaryArrCurrency, setAuxiliaryArrCurrency] = useState('USD')
  const [selectedDetailMap, setSelectedDetailMap] = useState<
    Record<
      string,
      ICurrentValue
    >|null
  >(null)

  const swiperRef = useRef<SwiperRef>(null)
  const [activeIndex, setActiveIndex] = useState(0)
  const [detailId, setDetailId] = useState('')

  const [bookingList, setBookingList] = useState<BookingOrder[]>([])
  const [bookingId, setBookingId] = useState<string>('')

  const [form] = Form.useForm()

  useImperativeHandle(ref,() => {
    return {
      openSurePop: sureAmount
    }
  })

  const detailInfo = useMemo(() => {
    return auxiliaryList.find(auxiliary => auxiliary.id === detailId);
  },[auxiliaryList,detailId])

  const sureAmount = (id:string) => {
    setDetailId(id)
    setVisiblePop(true)
    const info = auxiliaryList.find(auxiliary => auxiliary.id === id);
    if(info?.status === 'appendPaid'){
      form.setFieldsValue({
        laborServiceFees:info.confirmed?.laborServiceFees,
        netPaymentAmount:info.confirmed?.netPaymentAmount,
        remarks:info.confirmed?.remarks
      })
    }else{
      form.setFieldsValue({
        laborServiceFees:'',
        netPaymentAmount:'',
        remarks:''
      })
    }

    form.setFieldsValue({
      appendId:id,
      laborServiceFees:0
    })
    getBooking()
  }

  const getBooking = () => {
    getBookingOrdersGroup(orderDetail?.id as string).then(res => {
      setBookingList(res)
      setBookingId(res[0].id);
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

  const inquiryAux = async () => {
    setLoadingBtn(true)
    try {
      const form = {
        seekTypes: detailInfo?.appendForAttachTypes.map(appendForAttachType => ({
          flightNumbers:appendForAttachType.flightNumbers,
          passengerNames:appendForAttachType.passengerNames,
          type:appendForAttachType.type
        }))
      }
      const response = await appendConsultGroup(bookingId, form as {seekTypes:ISeekType[]})
      if(response.succeed){
        setAuxiliaryInquiryList(response.content.results)
        setAuxiliaryArrCurrency(response.content.currency)
      }else{
        Toast.show({
          icon: 'fail',
          content: response.message,
        })
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const bookingInfo = useMemo(() => {
    return bookingList.find(bk => bk.id === bookingId)
  },[bookingList,bookingId])

  const onFinish = async (val:UpOrderAppendAmounts) => {
    setLoadingBtn(true)
    try {
      const formData = {
        ...val,
        appendId:form.getFieldValue('appendId'),
      }
      const response = await upsertAppendAmountsGroup(formData,true)
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

  const executeAmount = () => {
    const message = t('order.auxiliaryTips', { tc:`${detailInfo?.confirmed?.netPaymentAmount}USD` })
    Dialog.confirm({
      content: message,
      onConfirm: async () => {
        const resposne = await setAppendAttachedGroup(detailId)
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

  const chooseOptions = useCallback(
    (name: string, value: ICurrentValue | null) => {
      setSelectedDetailMap(prev => {
        const current = prev ?? {}

        if (value === null) {
          const { [name]: _, ...rest } = current
          return rest
        }

        return {
          ...current,
          [name]: value,
        }
      })
    },
    []
  )

  const allSelectedTotalPrice = useMemo(() => {
    if(!selectedDetailMap) return 0

    return Object.entries(selectedDetailMap).reduce((sum, [key, detail]) => {
      const row = auxiliaryInquiryList?.find(r => r.resultKey === key)
      if (!row) return sum

      return (
        sum +
        detail.flightNumbers.length *
        detail.passengerNames.length *
        row.perPaymentAmount
      )
    }, 0)
  },[selectedDetailMap,auxiliaryInquiryList])

  const implementAuxiliary = async () => {
    if (!selectedDetailMap) {
      Toast.show({
        icon: 'fail',
        content: t('order.chooseAuxiliary')
      })
      return
    }
    const form = {
      seekTypes: detailInfo?.appendForAttachTypes.map(appendForAttachType => ({
        flightNumbers: appendForAttachType.flightNumbers,
        passengerNames: appendForAttachType.passengerNames,
        type: appendForAttachType.type
      })) ?? [],
      currency: auxiliaryArrCurrency,
      selecteds: Object.values(selectedDetailMap).filter(item => {
        return (
          item.flightNumbers?.length > 0 &&
          item.passengerNames?.length > 0
        )
      })
    }
    setLoadingBtn(true)
    try {
      const response = await bookingAppendGroup(bookingId,form as AppendConsultForm)
      if(response.succeed){
        Toast.show({
          icon:'success',
          content:t('order.purchaseAuxiliarySuccess')
        })
        closePop()
        resetDetailFnc()
      }else{
        Toast.show({
          icon: 'fail',
          content: response.message,
        })
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const closePop = () => {
    swiperRef.current?.swipeTo(0)
    setVisiblePop(false)
    setLoadingBtn(false)
    setAuxiliaryInquiryList([])
    setAuxiliaryArrCurrency('')
    setSelectedDetailMap(null)
    setDetailId('')
    setBookingList([])
    setBookingId('')
    setActiveIndex(0)
    swiperRef.current?.swipeTo(0)
    form.resetFields()
  }


  return (
    <Popup visible={visiblePop} position='right' showCloseButton onClose={closePop}
           bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
      <div className={'pt-0 h-full flex flex-col'}>
        <div className={'h-[40px] text-center leading-[40px]'}>
          <span className={'text-[1.4rem] font-bold '}>{t('order.auxiliary')}</span>
        </div>
        <Segmented options={tabItems} block className={'mb-0'} onChange={ key => {
          const index = tabItems.findIndex(item => item.value === key)
          setActiveIndex(index)
          swiperRef.current?.swipeTo(index)
        }}
                   value={tabItems[activeIndex].value} />
        <Swiper direction='horizontal'
                className={'flex-1 h-0'}
                indicator={() => null}
                ref={swiperRef}
                defaultIndex={activeIndex}
                onIndexChange={index => {
                  setActiveIndex(index)
                }}>
          <Swiper.Item>
            <div className={'overflow-auto h-full'}>
              <Form form={form} mode='card' onFinish={onFinish}
                    disabled={detailInfo?.status === 'appendPaid'}
                    footer={
                      <Space direction='vertical' block>
                        {
                          detailInfo?.status === 'appendPaid' && (
                            <Button block size='middle' style={{
                              '--background-color':'var(--warning-color)'
                            }} onClick={executeAmount}>
                              {t('order.executeAuxiliaryEd')}
                            </Button>
                          )
                        }
                        <Button block type='submit' color='primary' size='middle' disabled={detailInfo?.status === 'appendPaid'} loading={loadingBtn}>
                          {t('common.submit')}
                        </Button>
                      </Space>
                    }>
                <Form.Item name={'laborServiceFees'} label={t('order.laborServiceFeesAuxiliary')} rules={[
                  {required: true, message: t('order.laborServiceFeesAuxiliary')},
                ]}>
                  <Input placeholder={t('order.laborServiceFeesAuxiliary')} type={'number'}/>
                </Form.Item>
                <Form.Item name={'netPaymentAmount'} label={t('order.netPaymentAmountAuxiliary')} rules={[
                  {required: true, message: t('order.netPaymentAmountAuxiliary')},
                ]}>
                  <Input placeholder={t('order.netPaymentAmountAuxiliary')} type={'number'}/>
                </Form.Item>
                <Form.Item name={'remarks'} label={t('base.remarks')}>
                  <TextArea
                    placeholder={t('base.remarks')}
                    maxLength={100}
                    rows={2}
                    showCount
                  />
                </Form.Item>
              </Form>
            </div>
          </Swiper.Item>
          <Swiper.Item>
            <div className={'w-full h-full flex flex-col'}>
              <div className={'w-full flex justify-between items-center px-[12px] sticky top-0 left-0'} onClick={chooseBooking}>
                <div>
                  <span className={'text-[1rem] text-(--text)'}>{t('order.purchaseOrderNumber')}</span>
                  <p className={'text-[1.2rem] text-(--text-h)'}>{bookingInfo?.id}</p>
                </div>
                <div>
                  <Space>
                    <Tag color={'success'}>{t('common.'+ statusBookingTicket[bookingInfo?.status || 'created'])}</Tag>
                  </Space>
                </div>
              </div>
              <div className={'flex-1 h-0 p-[12px] pb-15 overflow-auto'}>
                {
                  detailInfo?.appendForAttachTypes.map(appendForAttachType => (
                    <div className={'mb-5'} key={appendForAttachType.type}>
                      <div className={'mb-2'}>
                        {
                          appendForAttachType.passengerNames?.map(passengerName => (
                            <Card key={passengerName} style={{
                              '--adm-color-background': '#ff8f1f14'
                            }}>
                              <div className={'flex flex-col'}>
                                <div className={'mb-3'}>
                                  <Tag color={'warning'}>{t(`order.${appendForAttachType?.type}`)}</Tag>
                                </div>
                                <PassengerCard passengerName={passengerName}/>
                                <span className={'text-(--text)'}>{t('order.flightNumber')} <span className={'text-[1.1rem] text-(--warning-color)'}>{appendForAttachType.flightNumbers?.join(',')}</span></span>
                              </div>
                            </Card>
                          ))
                        }
                      </div>
                      {
                        !!auxiliaryInquiryList.length && (
                          <div>
                            <div className={'flex justify-between mb-1'}>
                              <span className={'text-(--text) text-[1rem]'}>{t('order.auxiliaryProducts')}</span>
                            </div>
                            <div className={'mb-2'}>
                              {
                                auxiliaryInquiryList.map(axiliaryInquiry => (
                                  <ComboCard key={axiliaryInquiry.resultKey} auData={axiliaryInquiry} chooseOptionsFnc={value => chooseOptions(axiliaryInquiry.resultKey,value)} currentValue={selectedDetailMap?.[axiliaryInquiry.resultKey] || null} currency={'usd'} />
                                ))
                              }
                            </div>
                          </div>
                        )
                      }
                    </div>
                  ))
                }
              </div>
            </div>
            <div className={'w-full sticky bottom-0 left-0 flex items-center justify-between px-5 py-2 bg-white'}>
              <div className={'flex flex-col'}>
                <span className={'text-(--text) text-[1.1rem]'}>{t('order.totalPrice')}</span>
                <span className={'text-(--price-color) text-[2.6rem] font-bold mt-2'}>{allSelectedTotalPrice.toFixed(2)} <span className={'text-[1.2rem] font-normal'}>{auxiliaryArrCurrency}</span></span>
              </div>
              {
                !auxiliaryInquiryList.length ?
                  <Button color='warning' size='middle' loading={loadingBtn} onClick={inquiryAux}>{t('order.auxiliaryInquiry')}</Button>
                  :
                  <Button color='danger' size='middle' disabled={!allSelectedTotalPrice && detailInfo?.status === 'appendPaid'} loading={loadingBtn} onClick={implementAuxiliary}>{t('order.airlineAuxiliaryAmount')}</Button>
              }
            </div>
          </Swiper.Item>
        </Swiper>
      </div>
    </Popup>
  )
}))
