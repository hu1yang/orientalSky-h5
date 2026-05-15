import { createContext, useContext } from 'react'

import type {
  IChange,
  IOrderAuxiliary,
  IOrderManual,
  IRefund,
} from '@/types/order.ts'

export type IOrderManualInfo = IOrderManual & {
  branchCode: string
  agentCode: string
}

export interface IDetailContext {
  orderDetail: IOrderManualInfo | null
  refundList: IRefund[]
  changeList: IChange[]
  auxiliaryList: IOrderAuxiliary[]

  setOrderDetail: (val: IOrderManualInfo) => void
  setAuxiliaryList: (val: IOrderAuxiliary[]) => void
  setChangeList: (val: IChange[]) => void
  setRefundList: (val: IRefund[]) => void
}

export const DetailContext =
  createContext<IDetailContext | null>(null)

export function useDetailData() {
  const ctx = useContext(DetailContext)

  if (!ctx) {
    throw new Error('useDetailData must in provider')
  }

  return ctx
}
