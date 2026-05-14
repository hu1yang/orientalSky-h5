import React, { memo, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import {Card, Divider, Grid, Tabs} from "antd-mobile";
import type {IOrderAuxiliary, Itinerary, Passenger} from "@/types/order.ts";
import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import CardText from "@/component/card/cardText.tsx";
import {statusAuxiliaryArs} from "@/utils/common.ts";

export default memo(function AuxiliaryDetail({auxiliaryList, passengers, itineraries}: {
  auxiliaryList: IOrderAuxiliary[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [auxiliaryTab, setAuxiliaryTab] = useState('')

  const auxiliaryDetail = useMemo(() => {
    return auxiliaryList.find(auxiliary => auxiliary.id === auxiliaryTab)
  },[auxiliaryTab,auxiliaryList])

  const auxiliaryPassenger = useMemo(() => {
    const passengerArr = auxiliaryDetail?.appendForAttachTypes.map(atp => atp.passengerNames) ?? []
    return passengers.filter(p => Array.from(new Set(...passengerArr))?.includes(p.fullName))
  },[passengers,auxiliaryDetail])

  const auxiliaryItineraries = useMemo(() => {
    if (!itineraries || !auxiliaryDetail?.appendForAttachTypes) return [];
    const flightNumbersArr = auxiliaryDetail.appendForAttachTypes.map(atp => atp.flightNumbers) ?? []
    return itineraries
      .map(it => {
        const segments = it.segments.filter(segment => {
          return Array.from(new Set(...flightNumbersArr)).includes(segment.flightNumber as string);
        });

        return {
          ...it,
          segments
        };
      });
  }, [itineraries, auxiliaryDetail]);

  useEffect(() => {
    if(auxiliaryList.length){
      setAuxiliaryTab(auxiliaryList[0].id)
    }
  },[auxiliaryList])

  return (
    <div>
      {
        !!auxiliaryList.length && (
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
                      auxiliaryDetail?.confirmed && (
                        <>
                          <Divider />
                          <CardText label={t('order.laborServiceFeesAuxiliary')}
                                    value={<span className={'!text-[1.2rem] mr-2'}>{auxiliaryDetail?.confirmed.laborServiceFees}</span>}
                                    labelStyle={'!w-30'}/>
                          <CardText label={t('base.remarks')}
                                    value={auxiliaryDetail?.confirmed.remarks}
                                    labelStyle={'!w-30'} style={'!items-start'} valueStyle={'!text-(--text)'} />
                          <CardText label={t('order.netPaymentAmountAuxiliary')} value={<div>
                            <span className={'font-bold !text-[1.7rem] mr-2'}>{auxiliaryDetail?.confirmed.netPaymentAmount}</span>
                            <span className={'!text-[1.2rem] text-(--text)'}>{auxiliaryDetail?.confirmed.currency}</span>
                          </div>} labelStyle={'!w-30'}/>
                          <Divider />
                          <CardText label={'Settlement total'} value={<div>
                            <span className={'font-bold !text-[1.7rem] mr-2 text-(--price-color)'}>{auxiliaryDetail?.confirmed.netPaymentAmount}</span>
                            <span className={'!text-[1.2rem] text-(--text)'}>{auxiliaryDetail?.confirmed.currency}</span>
                          </div>} valueStyle={'text-right'} labelStyle={'font-bold !w-auto !text-[1.2rem]'} />
                        </>
                      )
                    }
                  </Card>
                </Tabs.Tab>
              ))
            }
          </Tabs>
        )
      }
    </div>
  )
})
