import React, {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import {Button, Card, Dialog, Divider, Grid, Tabs, TextArea, Toast} from "antd-mobile";
import type {IOrderAuxiliary, Itinerary, Passenger} from "@/types/order.ts";
import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import CardText from "@/component/card/cardText.tsx";
import {statusAuxiliaryArs} from "@/utils/common.ts";
import NoData from "@/component/default/noData.tsx";
import AuxiliaryAmount from "@/component/order/form/auxiliaryAmount.tsx";
import {
  appendRejectGroup,
  getAppendInfoGroup,
  rejectAppendAmountsGroup,
  setAppendAttachedGroup
} from "@/utils/request/group.ts";
import {useDetailData} from "@/context/order/detailContext.tsx";
import {result} from "@/utils/public.ts";

export default memo(function AuxiliaryDetail({auxiliaryList, passengers, itineraries}: {
  auxiliaryList: IOrderAuxiliary[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [auxiliaryTab, setAuxiliaryTab] = useState('')
  const amountRef = useRef<{
    openSurePop:(id: string) => void
  }>(null);

  const {setAuxiliaryList} = useDetailData()


  const auxiliaryDetail = useMemo(() => {
    return auxiliaryList.find(auxiliary => auxiliary.id === auxiliaryTab)
  },[auxiliaryTab,auxiliaryList])

  const auxiliaryPassenger = useMemo(() => {
    const passengerArr = auxiliaryDetail?.appendForAttachTypes.map(atp => atp.passengerNames) ?? []
    return passengers.filter(p => Array.from(new Set(...passengerArr))?.includes(p.fullName))
  },[passengers,auxiliaryDetail])

  const auxiliaryItineraries = useMemo(() => {
    if (!itineraries || !auxiliaryDetail?.appendForAttachTypes) return [];

    const flightNumbersSet = new Set(
      auxiliaryDetail.appendForAttachTypes.flatMap(atp => atp.flightNumbers ?? [])
    );

    return itineraries.reduce<typeof itineraries>((acc, it) => {
      const matchedSegments = it.segments.filter(segment =>
        flightNumbersSet.has(segment.flightNumber as string)
      );

      if (matchedSegments.length > 0) {
        acc.push({
          ...it,
          segments: matchedSegments
        });
      }

      return acc;
    }, []);
  }, [itineraries, auxiliaryDetail]);

  const sureAmount = () => {
    if(amountRef.current){
      amountRef.current.openSurePop(auxiliaryTab)
    }
  }

  const executeAmount = () => {
    const message = t('order.auxiliaryTips', { tc:`${auxiliaryDetail?.confirmed?.netPaymentAmount}USD` })
    Dialog.confirm({
      content: message,
      onConfirm: async () => {
        const resposne = await setAppendAttachedGroup(auxiliaryTab)
        result(resposne)
        if(resposne.succeed){
          getDetail()
        }else{
          throw new Error()
        }
      }
    })
  }

  const rejectAuxiliary = () => {
    let remarks = ''
    Dialog.confirm({
      content: (
        <div className={'w-full flex flex-col justify-start'}>
          <span className={'mb-2 font-bold text-[1.3rem] mb-2'}>{t('order.auxiliaryRejectTips')}</span>
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
        const resposne = await appendRejectGroup(auxiliaryTab,{message:remarks})
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
        const resposne = await rejectAppendAmountsGroup(auxiliaryTab,{message:remarks})
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
    const response = await getAppendInfoGroup(auxiliaryTab as string)
    const newAuxiliaryList = auxiliaryList.map(item =>
      item.id === response.id ? {...response}:item
    )
    setAuxiliaryList(newAuxiliaryList)
  },[auxiliaryTab,auxiliaryList])

  useEffect(() => {
    if(auxiliaryList.length && !auxiliaryTab){
      setAuxiliaryTab(auxiliaryList[0].id)
    }
  },[auxiliaryList,auxiliaryTab])

  return (
    <div>
      {
        auxiliaryList.length ? (
          <Tabs activeKey={auxiliaryTab} style={{
            '--title-font-size':'1rem',
            '--content-padding':'12px 0'
          }} onChange={(val) => setAuxiliaryTab(val)}>
            {
              auxiliaryList.map(auxiliary => (
                <Tabs.Tab key={auxiliary.id} title={`${auxiliary.id}(${t('common.'+statusAuxiliaryArs[auxiliary.status])})`}>
                  <PassengerCard passengers={auxiliaryPassenger} status={'auxiliary'} />
                  <SegmentCard itineraryList={auxiliaryItineraries} status={'auxiliary'} />
                  <Card title={'价格确认表'}>
                    {
                      auxiliary.appendForAttachTypes.map((appendForAttachType,appendForAttachTypeIndex) => (
                        <React.Fragment key={appendForAttachTypeIndex}>
                          <Grid columns={2}>
                            <Grid.Item span={2}>
                              <CardText label={'姓名/证件号'} value={appendForAttachType.passengerNames?.join(',')}
                                        valueStyle={'!text-(--warning-color)'} labelStyle={'!w-30'} />
                            </Grid.Item>
                            <Grid.Item>
                              <CardText label={'航班号'} value={appendForAttachType.flightNumbers?.join(',')}
                                        valueStyle={'!text-(--warning-color)'} labelStyle={'!w-30'} />
                            </Grid.Item>
                            <Grid.Item>
                              <CardText label={'辅营产品'} value={t('order.'+appendForAttachType?.type)}
                                        valueStyle={'!text-(--warning-color)'} labelStyle={'!w-30'} />
                            </Grid.Item>
                            <Grid.Item span={2}>
                              <CardText label={'辅营单说明'} value={appendForAttachType.attachNotes?.join(',')}
                                        labelStyle={'!w-30'} style={'!items-start'} valueStyle={'!text-(--text)'} />
                            </Grid.Item>
                          </Grid>
                          {
                            auxiliary.appendForAttachTypes.length - 1 !== appendForAttachTypeIndex && (
                              <Divider style={{
                                borderStyle: 'dashed',
                                margin: '8px 0'
                              }} />
                            )
                          }
                        </React.Fragment>
                      ))
                    }
                    {
                      auxiliary?.confirmed && (
                        <>
                          <Divider />
                          <CardText label={t('order.laborServiceFeesAuxiliary')}
                                    value={<span className={'!text-[1.2rem] mr-2'}>{auxiliary?.confirmed.laborServiceFees}</span>}
                                    labelStyle={'!w-30'}/>
                          <CardText label={t('base.remarks')}
                                    value={auxiliary?.confirmed.remarks}
                                    labelStyle={'!w-30'} style={'!items-start'} valueStyle={'!text-(--text)'} />
                          <CardText label={t('order.netPaymentAmountAuxiliary')} value={<div>
                            <span className={'font-bold !text-[1.7rem] mr-2'}>{auxiliary?.confirmed.netPaymentAmount}</span>
                            <span className={'!text-[1.2rem] text-(--text)'}>{auxiliary?.confirmed.currency}</span>
                          </div>} labelStyle={'!w-30'}/>
                          <Divider />
                          <CardText label={'Settlement total'} value={<div>
                            <span className={'font-bold !text-[1.7rem] mr-2 text-(--price-color)'}>{auxiliary?.confirmed.netPaymentAmount}</span>
                            <span className={'!text-[1.2rem] text-(--text)'}>{auxiliary?.confirmed.currency}</span>
                          </div>} valueStyle={'text-right'} labelStyle={'font-bold !w-auto !text-[1.2rem]'} />
                        </>
                      )
                    }
                  </Card>
                  {
                    auxiliary.status !== 'cancelled' && (
                      <Grid columns={2} gap={8} className={'sticky bottom-0 left-0 mt-5'}>
                        <Grid.Item span={['confirmed','appendPaid'].includes(auxiliary.status)?1:2}>
                          {
                            ['appendPaid','attached'].includes(auxiliary.status)?
                              <Button block disabled={auxiliary.status !== 'appendPaid'} style={{
                                '--background-color':'var(--warning-color)'
                              }} onClick={executeAmount}>
                                {
                                  !['appendPaid'].includes(auxiliary.status) ? t('common.'+ statusAuxiliaryArs[auxiliary.status]) : '执行辅营'
                                }
                              </Button>
                              :
                              <Button block disabled={auxiliary.status !== 'created'} style={{
                                '--background-color':'var(--success-color)'
                              }} onClick={sureAmount}>
                                金额确认
                              </Button>
                          }
                        </Grid.Item>
                        {
                          ['confirmed','appendPaid'].includes(auxiliary.status) && (
                            <Grid.Item>
                              {
                                ['appendPaid'].includes(auxiliary.status)?
                                  <Button block onClick={rejectAuxiliary}>辅营驳回</Button>
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
        )
        :
        <NoData />
      }
      <AuxiliaryAmount ref={amountRef} resetDetailFnc={getDetail} />
    </div>
  )
})
