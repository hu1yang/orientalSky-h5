import { useMemo, useState } from 'react'

import type {
  IChange,
  IOrderAuxiliary,
  IRefund,
} from '@/types/order.ts'
import {DetailContext, type IOrderManualInfo} from "@/context/order/detailContext.tsx";

export default function DetailListProvider({
                                             children,
                                           }: {
  children: React.ReactNode
}) {
  const [orderDetail, setOrderDetail] =
    useState<IOrderManualInfo | null>(null)

  const [refundList, setRefundList] =
    useState<IRefund[]>([])

  const [changeList, setChangeList] =
    useState<IChange[]>([])

  const [auxiliaryList, setAuxiliaryList] =
    useState<IOrderAuxiliary[]>([])

  const value = useMemo(
    () => ({
      orderDetail,
      refundList,
      changeList,
      auxiliaryList,
      setOrderDetail,
      setRefundList,
      setChangeList,
      setAuxiliaryList
    }),
    [
      orderDetail,
      refundList,
      changeList,
      auxiliaryList
    ]
  )

  return (
    <DetailContext.Provider value={value}>
      {children}
    </DetailContext.Provider>
  )
}
