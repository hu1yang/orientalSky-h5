import {memo} from "react";
import {useTranslation} from "react-i18next";
import {Card, Divider, Grid} from "antd-mobile";

import type {IPolicies, Itinerary} from "@/types/order.ts";
import CardText from "@/component/card/cardText.tsx";
import {passengerTypes} from "@/utils/public.ts";
import {RightOutline} from "antd-mobile-icons";


export default memo(function AmountCard({itineraryList, travelers, currency, totalPrice, policies}: {
  itineraryList: Itinerary[], travelers: {
    passengerCount: number
    passengerType: 'adt' | 'chd' | 'inf'
  }[], currency: string, totalPrice: string, policies: IPolicies[]
}) {
  const {t} = useTranslation()

  return (
    <Card className={'mb-5'} title={'Amounts'} extra={<RightOutline />}>
      <div className={'mb-4 flex justify-between'}>
        <div>
          {
            travelers.map((traveler) => (
              <p key={traveler.passengerType} className={'text-(--text) text-[1.2rem] leading-none !mb-1'}>{t('order.'+passengerTypes[traveler.passengerType].toLocaleLowerCase())} × {traveler.passengerCount} · {currency}</p>
            ))
          }
        </div>
      </div>
      {
        itineraryList.map((itinerarie,itinerarieIndex) => (
          <div key={itinerarie.id} className={'mb-2'}>
            <div className={'flex justify-between mb-2'}>
              <span className={'font-bold text-[1.2rem]'}>{itinerarie.segments[0].departureAirport} → {itinerarie.segments[itinerarie.segments.length-1].arrivalAirport}</span>
              <span className={'text-[.9rem]'}>{itinerarie.amounts[0].familyName}</span>
            </div>
            <Grid columns={2} gap={8}>
              <Grid.Item>
                <div className={'bg-(--code-bg) p-4 rounded-(--rounder-radius)'}>
                  <span className={'font-medium text-(--text-h) text-[1.1rem]'}>Fare</span>
                  {
                    itinerarie.amounts.map(amount => (
                      <div className={'flex justify-between items-center mb-1'} key={amount.familyCode}>
                        <p className={'text-(--text) text-[1.2rem]'}>{Number(amount.printAmount).toFixed(2)}</p>
                        <span className={'text-(--warning-color)'}>{t('order.'+passengerTypes[amount.passengerType as 'adt'| 'chd'| 'inf'].toLocaleLowerCase())}</span>
                      </div>
                    ))
                  }
                </div>
              </Grid.Item>
              <Grid.Item>
                <div className={'bg-(--code-bg) p-4 rounded-(--rounder-radius)'}>
                  <span className={'font-medium text-(--text-h) text-[1.1rem]'}>Tax</span>
                  {
                    itinerarie.amounts.map(amount => (
                      <div className={'flex justify-between items-center mb-1'} key={amount.familyCode}>
                        <p className={'text-(--text) text-[1.2rem]'}>{Number(amount.taxesAmount).toFixed(2)}</p>
                        <span className={'text-(--warning-color)'}>{t('order.'+passengerTypes[amount.passengerType as 'adt'| 'chd'| 'inf'].toLocaleLowerCase())}</span>
                      </div>
                    ))
                  }
                </div>
              </Grid.Item>
            </Grid>
            <Divider
              style={{
                borderStyle: 'dashed',
              }} />
            <CardText label={'Discount'} value={<div className={'flex justify-end flex-col'}>
              {
                itinerarie.amounts.map(amount => (
                  <span
                    key={amount.familyCode}>{t('order.' + passengerTypes[amount.passengerType as 'adt' | 'chd' | 'inf'].toLocaleLowerCase())} ({amount?.commissionAmount ?? '--'}/{amount?.commissionRebate != null
                    ? (Number(amount?.commissionRebate) * 100).toFixed(0) + '%'
                    : '--'})</span>
                ))
              }
            </div>} valueStyle={'text-right !text-(--text)'} labelStyle={'text-(--text)'} style={'items-start mb-2'} />
            <CardText label={'Profit'} value={<div className={'flex justify-end flex-col'}>
              {
                itinerarie.amounts.map(amount => {
                  const policie = policies.find(policie => policie.familyCode === amount.familyCode)
                  const traveler = travelers.find(traveler => traveler.passengerType === amount.passengerType)
                  return (
                    <span
                      key={amount.familyCode}>
                      {t('order.' + passengerTypes[amount.passengerType as 'adt' | 'chd' | 'inf'].toLocaleLowerCase())}
                      {policie ? policie.discount : '0'} * {traveler?.passengerCount}
                    </span>
                  )
                })
              }
            </div>} valueStyle={'text-right font-bold'} labelStyle={'text-(--text)'} style={'items-start'} />
            {
              itinerarieIndex !== itineraryList.length - 1 && (
                <Divider />
              )
            }
          </div>
        ))
      }

      <Divider />
      <CardText label={'Settlement total'} value={<div>
        <span className={'font-bold !text-[1.7rem] mr-2'}>{totalPrice}</span>
        <span className={'!text-[1.2rem] text-(--text)'}>{currency}</span>
      </div>} valueStyle={'text-right'} labelStyle={'font-bold !w-auto !text-[1.2rem]'} />
    </Card>
  )
})
