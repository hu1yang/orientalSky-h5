import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import {Button, Dialog, Grid, Tabs, TextArea, Toast} from "antd-mobile";

import {useDetailData} from "@/context/order/detailContext.tsx";
import {
  getRefundInfoGroup,
  paymentRefundGroup,
  refundRejectGroup,
  rejectRefundAmountsGroup
} from "@/utils/request/group.ts";
import {statusRefundArs} from "@/utils/common.ts";

import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import PriceConfirmation from "@/component/order/detail/priceConfirmation.tsx";
import RCAmount from "@/component/order/form/rcAmount.tsx";

import type {IRefund, Itinerary, Passenger} from "@/types/order.ts";
import {result} from "@/utils/public.ts";
import NoData from "@/component/default/noData.tsx";

export default memo(function RefundDetail({refundList, passengers, itineraries}: {
  refundList: IRefund[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [refundTab, setRefundTab] = useState('')
  const amountRef = useRef<{
    openSurePop:(passengers: Passenger[],id: string) => void
  }>(null);

  const {setRefundList} = useDetailData()

  const refundDetail = useMemo(() => {
    return refundList.find(refund => refund.id === refundTab)
  },[refundTab,refundList])

  const refundPassenger = useMemo(() => {
    const rpIdArr = refundDetail?.refundForPassengers.map(rp => rp.subPassengerId)
    return passengers.filter(p => rpIdArr?.includes(p.id))
  },[passengers,refundDetail])

  const refundItineraries = useMemo(() => {
    if (!itineraries || !refundDetail?.refundForItineraries) return [];

    const refundMap = new Map(
      refundDetail.refundForItineraries.map(ri => [ri.subItineraryId, ri])
    );

    return itineraries
      .filter(it => refundMap.has(it.id))
      .map(it => {
        const riArr = refundMap.get(it.id);
        const segments = it.segments.filter(segment => {
          if (!riArr?.flightNumbers || riArr.flightNumbers.length === 0) {
            return true;
          }
          return riArr.flightNumbers.includes(segment.flightNumber);
        });

        return {
          ...it,
          segments
        };
      });
  }, [itineraries, refundDetail]);

  const totalPrice = useMemo(() => {
    if(!refundDetail?.confirmed) return 0

    const total = refundDetail?.confirmed.amounts.reduce((sum, amount) => {
      const netRefundAmount = Number(amount.netRefundAmount) || 0
      return sum + netRefundAmount;
    }, 0);

    return Math.round(total * 100) / 100; // 最终总价再处理一遍
  }, [refundDetail])

  const sureAmount = () => {
    if(amountRef.current){
      amountRef.current.openSurePop(refundPassenger,refundTab as string)
    }
  }

  const executeAmount = () => {
    const message = t('order.refundTips', { tc:`${totalPrice}USD` })
    Dialog.confirm({
      content: message,
      onConfirm: async () => {
        const resposne = await paymentRefundGroup(refundTab)
        result(resposne)
        if(resposne.succeed){
          getDetail()
        }else{
          throw new Error()
        }
      }
    })
  }

  const rejectAmount = () => {
    let remarks = ''
    Dialog.confirm({
      content: (
        <div className={'w-full flex flex-col justify-start'}>
          <span className={'mb-2 font-bold text-[1.3rem] mb-2'}>{t('order.amountRejectTips')}</span>
          <TextArea
            style={{
              '--font-size': '1.2rem'
            }}
            placeholder={t('order.messageShow')}
            onChange={val => {
              remarks = val
            }}
          />
        </div>
      ),
      onConfirm: async () => {
        if(!remarks){
          Toast.show({
            content: t('order.messageShow'),
          })
          throw new Error()
        }
        const resposne = await rejectRefundAmountsGroup(refundTab,{message:remarks})
        if(!resposne) throw new Error()
        result(resposne)
        if(resposne.succeed){
          getDetail()
        }else{
          throw new Error()
        }
      }
    })
  }

  const rejectRefund = () => {
    let remarks = ''
    Dialog.confirm({
      content: (
        <div className={'w-full flex flex-col justify-start'}>
          <span className={'mb-2 font-bold text-[1.3rem] mb-2'}>{t('order.refundRejectTips')}</span>
          <TextArea
            style={{
              '--font-size': '1.2rem'
            }}
            placeholder={t('order.messageShow')}
            onChange={val => {
              remarks = val
            }}
          />
        </div>
      ),
      onConfirm: async () => {
        if(!remarks){
          Toast.show({
            content: t('order.messageShow'),
          })
          throw new Error()
        }
        const resposne = await refundRejectGroup(refundTab,{message:remarks})
        if(!resposne) throw new Error()
        result(resposne)
        if(resposne.succeed){
          getDetail()
        }else{
          throw new Error()
        }
      }
    })
  }

  const getDetail = useCallback(async () => {
    const response = await getRefundInfoGroup(refundTab as string)
    const newChangeList = refundList.map(item =>
      item.id === response.id ? {...response}:item
    )

    setRefundList(newChangeList)
  },[refundTab,refundList])

  useEffect(() => {
    if(refundList.length && !refundTab){
      setRefundTab(refundList[0].id)
    }
  },[refundList])

  return (
    <div>
      {
        refundList.length ? (
          <Tabs activeKey={refundTab} style={{
            '--title-font-size':'1rem',
            '--content-padding':'12px 0'
          }} onChange={(val) => setRefundTab(val)}>
            {
              refundList.map(refund => (
                <Tabs.Tab key={refund.id} title={`${refund.id}(${t('common.'+ statusRefundArs[refund.status])})`}>
                  <PassengerCard passengers={refundPassenger} status={'refund'} />
                  <SegmentCard itineraryList={refundItineraries} status={'refund'} />
                  {
                    !!refund.confirmed && (
                      <PriceConfirmation confirmed={refund.confirmed} currency={refund.order?.currency || ''} type={'refund'} totalPrice={totalPrice} />
                    )
                  }
                  {
                    refund.status !== 'cancelled' && (
                      <Grid columns={2} gap={8} className={'sticky bottom-0 left-0 mt-5'}>
                        <Grid.Item span={['refundPaid','completed','executed'].includes(refund.status)?1:2}>
                          {
                            ['refundPaid','completed','executed'].includes(refund.status)?
                              <Button block disabled={refund.status !== 'executed'} style={{
                                '--background-color':'var(--warning-color)'
                              }} onClick={executeAmount}>
                                {
                                  ['refundPaid','completed'].includes(refund.status) ? t('common.'+ statusRefundArs[refund.status]) : '执行退款'
                                }
                                </Button>
                              :
                              <Button block disabled={refund.status !== 'created'} style={{
                                '--background-color':'var(--success-color)'
                              }} onClick={sureAmount}>
                                金额确认
                              </Button>
                          }
                        </Grid.Item>
                        {
                          ['refundPaid','completed','executed'].includes(refund.status) && (
                            <Grid.Item>
                              {
                                ['refundPaid','completed'].includes(refund.status)?
                                  <Button block onClick={rejectRefund}>退款驳回</Button>
                                  :
                                  <Button block onClick={rejectAmount}>金额驳回</Button>
                              }
                            </Grid.Item>
                          )
                        }
                      </Grid>
                    )
                  }
                </Tabs.Tab>
              ))
            }
          </Tabs>
        ):
          <NoData />

      }
      <RCAmount ref={amountRef} resetDetailFnc={getDetail} type={'refund'} />
    </div>
  )
})
