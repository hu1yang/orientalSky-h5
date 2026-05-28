import React, {memo, useMemo} from "react";
import {useTranslation} from "react-i18next";

import {Card, Divider, Grid} from "antd-mobile";
import CardText from "@/component/card/cardText.tsx";
import type {IConfirmed} from "@/types/order.ts";

export default memo(function PriceConfirmation({confirmed, currency, type, totalPrice}: {
  confirmed: IConfirmed
  currency: string
  type: 'refund' | 'change'
  totalPrice: string | number
}) {
  const {t} = useTranslation()

  const titleTip = useMemo(() => {
    switch (type){
      case 'refund':
        return t('order.refundConfirmed')
      case 'change':
        return t('order.changeConfirmed')
    }
  },[type])

  return (
    <Card title={titleTip}>
      {
        !!confirmed.amounts.length && (
          confirmed.amounts.map((amount, amountIndex) => (
            <React.Fragment key={amountIndex}>
              <Grid columns={2}>
                <Grid.Item span={2}>
                  <CardText label={`${t('order.fullName')}/${t('order.travelerIdNo')}`} value={`${amount.fullName}(${amount.idNumber})`}
                            valueStyle={'!text-(--warning-color)'} labelStyle={'!w-30'}/>
                </Grid.Item>
                <Grid.Item span={2}>
                  <CardText label={type === 'refund'?t('order.netRefundAmount'):t('order.netChangeAmount')} value={<div>
                    <span
                      className={'font-bold !text-[1.7rem] mr-2'}>{type === 'refund' ? amount.netRefundAmount : amount.netChangeAmount}</span>
                    <span className={'!text-[1.2rem] text-(--text)'}>{currency}</span>
                  </div>} labelStyle={'!w-30'}/>
                </Grid.Item>
                <Grid.Item>
                  <CardText label={t('order.netServiceFees')}
                            value={<span className={'!text-[1.2rem] mr-2'}>{amount.netServiceFees}</span>}
                            labelStyle={'!w-30'}/>
                </Grid.Item>
                <Grid.Item>
                  <CardText label={t('order.deductionAmount')}
                            value={<span className={'!text-[1.2rem] mr-2'}>{amount.deductionAmount}</span>}
                            labelStyle={'!w-30'}/>
                </Grid.Item>
                <Grid.Item span={2}>
                  <CardText label={t('foundation.othersNotes')}
                            value={amount.othersNotes.length ? (amount.othersNotes as string[])?.join(',') : '--'}
                            labelStyle={'!w-30'} style={'!items-start'} valueStyle={'!text-(--text)'}/>
                </Grid.Item>
              </Grid>
              {
                (confirmed.amounts.length - 1 !== amountIndex) && (
                  <Divider style={{
                    borderStyle: 'dashed',
                    margin: '8px 0'
                  }}/>
                )
              }
            </React.Fragment>
          ))
        )
      }
      <Divider/>
      <CardText label={t('order.totalSettlementPrice')} value={<div>
        <span className={'font-bold !text-[1.7rem] mr-2 text-(--price-color)'}>{totalPrice}</span>
        <span className={'!text-[1.2rem] text-(--text)'}>{currency}</span>
      </div>} valueStyle={'text-right'} labelStyle={'font-bold !w-auto !text-[1.2rem]'}/>
    </Card>
  )
})
