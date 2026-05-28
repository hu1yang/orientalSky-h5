import React , {memo} from "react";
import {useTranslation} from "react-i18next";
import {Card, Divider} from "antd-mobile";
import CardText from "@/component/card/cardText.tsx";
import {RightOutline} from "antd-mobile-icons";
import type {Passenger} from "@/types/order.ts";
import {passengerTypes} from "@/utils/public.ts";
import {passengerIdTypeArr, passengerSexTypeArr} from "@/utils/common.ts";

export default memo(function PassengerCard({passengers,status = 'ticket'}:{
  passengers:Passenger[]
  status?:'ticket'|'refund'|'change'|'auxiliary'
}){
  const {t} = useTranslation()

  return (
    <Card className={'mb-5'} title={t('order.passenger')} extra={<RightOutline />}>
      {
        passengers.map((passenger,passengerIndex) => (
          <React.Fragment key={passenger.id}>
            <div className={'mb-2'} key={`passenger-${passenger.id}`}>
              <div className={'flex justify-between items-center'}>
                <div className={'flex items-center'}>
                  <div className={'rounded-[50%] w-[35px] h-[35px] bg-[#f3f4f6] flex items-center justify-center'}>
                    <span className={'text-(--text)'}>
                      {
                        passenger.passengerSexType === 'm' ?
                          <i className={'iconfont icon-male !text-[1.7rem]'}></i>
                          :
                          <i className={'iconfont icon-female !text-[1.7rem]'}></i>
                      }
                    </span>
                  </div>
                  <div className={'flex flex-col ml-4'}>
                    <span className={`font-bold text-[1.2rem] ${passenger.passengerType !== 'adt' ? 'text-(--warning-color)' : 'text-(--text-h)' }`}>{passenger.fullName}</span>
                    <p className={'text-(--text) text-[1rem]'}>{t('order.'+passengerTypes[passenger.passengerType as 'adt'| 'chd'| 'inf'].toLocaleLowerCase())} · {t('order.' + passengerSexTypeArr[passenger.passengerSexType])} · {passenger.trCountry}</p>
                  </div>
                </div>
                <div>
                  {
                    status !== 'ticket' && (
                      <span className={`${status === 'refund'?'text-(--price-color)':'text-(--warning-color)'} text-[1.2rem] font-bold`}>{t('order.'+status)}</span>
                    )
                  }
                </div>
              </div>
              <Divider style={{
                borderStyle: 'dashed',
                margin: '8px 0'
              }} />
              <CardText label={t('order.documents')} value={`${passenger.idNumber || '--'} · ${t('order.'+passengerIdTypeArr[passenger.passengerIdType])}`} labelStyle={'!w-20'} valueStyle={'text-right text-[1.1rem] font-bold'} />
              <CardText label={t('order.birthday')} value={passenger.birthday} labelStyle={'!w-20'} valueStyle={'text-right text-[1.1rem] font-bold'} />
              <CardText label={t('order.expiryDate')} value={passenger.expiryDate} labelStyle={'!w-20'} valueStyle={'text-right text-[1.1rem] font-bold'} />
              <CardText label={`${t('order.pnr')} / ${t('order.ticketNumber')}`} value={
                <div className={'flex justify-end flex-col'}>
                  {
                    passenger.ticketNumbers.length ? passenger.ticketNumbers.map(ticketNumber => (
                      <span
                        key={ticketNumber.id}>
                        {ticketNumber.bookingNumber} / {ticketNumber.ticketNumber}
                      </span>
                    )) : <span className={'text-(--text) text-[1.2rem]'}>--</span>
                  }
                </div>
              } labelStyle={'!w-auto'} valueStyle={'text-right text-[1.1rem] !text-(--success-color)'} style={'!items-start'} />
              <CardText label={t('order.contact')} value={`${passenger.phoneNumber}`} labelStyle={'!w-auto'} valueStyle={'text-right text-[1.1rem] font-bold'} />
            </div>
            {
              passengerIndex !== passengers.length - 1 && (
                <Divider key={`Divider-${passenger.id}`} />
              )
            }
          </React.Fragment>
        ))
      }
    </Card>
  )
})
