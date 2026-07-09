import {createSelector, createSlice, type PayloadAction} from "@reduxjs/toolkit";
import type {IAuxiliaryStatus, IChangeStatus, InotifyList, IRefundStatus, ITicketStatus} from "@/types/order.ts";
import type {RootState} from "@/store";

interface InitialState {
  changeOrder:Record<IChangeStatus, number>
  ticketOrder:Record<ITicketStatus, number>
  refundOrder:Record<IRefundStatus, number>
  auxiliaryOrder:Record<IAuxiliaryStatus, number>
  notifyList: InotifyList[]
  notifyVisible: boolean
}
const initialState: InitialState = {
  ticketOrder:{
    created:0,
    confirming:0,
    confirmed:0,
    userPaid:0,
    ticketing:0,
    processing:0,
    switching:0,
    following:0,
    ticketed:0,
    completed:0,
    cancelled:0,
  },
  changeOrder: {
    created: 0,
    confirming: 0,
    confirmed: 0,
    changePaid: 0,
    changing: 0,
    processing: 0,
    following: 0,
    switching: 0,
    changed: 0,
    completed: 0,
    cancelled: 0,
  },
  refundOrder: {
    created: 0,
    confirming: 0,
    confirmed: 0,
    executed: 0,
    refunding: 0,
    processing: 0,
    following: 0,
    switching: 0,
    refunded: 0,
    refundPaid: 0,
    completed: 0,
    cancelled: 0,
  },
  auxiliaryOrder:{
    created: 0,
    confirming: 0,
    confirmed: 0,
    appendPaid: 0,
    attaching: 0,
    processing: 0,
    switching: 0,
    following: 0,
    attached: 0,
    completed: 0,
    cancelled: 0
  },
  notifyList:[],
  notifyVisible: false,
}

const menuSlice = createSlice({
  name: 'menu',
  initialState,
  reducers: {
    initAllOrders(state, action: PayloadAction<{
      ticketOrder: InitialState['ticketOrder']
      changeOrder: InitialState['changeOrder']
      refundOrder: InitialState['refundOrder']
      auxiliaryOrder: InitialState['auxiliaryOrder']
    }>) {
      const { ticketOrder, changeOrder, refundOrder, auxiliaryOrder } = action.payload;
      state.ticketOrder = {
        ...state.ticketOrder,
        ...ticketOrder
      };
      state.changeOrder = {
        ...state.changeOrder,
        ...changeOrder
      };
      state.refundOrder = {
        ...state.refundOrder,
        ...refundOrder
      };
      state.auxiliaryOrder = {
        ...state.auxiliaryOrder,
        ...auxiliaryOrder
      };
    },
    setOrderNumber(
      state,
      action: PayloadAction<{
        type: 'order' | 'change' | 'refund' | 'auxiliary'
        from: IChangeStatus | IRefundStatus | ITicketStatus | IAuxiliaryStatus | null
        to: IChangeStatus | IRefundStatus | ITicketStatus | IAuxiliaryStatus
      }>
    ) {
      const { type, from, to } = action.payload

      switch (type){
        case 'order':
          if (from && state.ticketOrder[from as keyof InitialState['ticketOrder']] > 0) {
            state.ticketOrder[from as keyof InitialState['ticketOrder']] -= 1
          }
          if (to) {
            state.ticketOrder[to as keyof InitialState['ticketOrder']] += 1
          }
          break
        case 'change':
          if (from && state.changeOrder[from as keyof InitialState['changeOrder']] > 0) {
            state.changeOrder[from as keyof InitialState['changeOrder']] -= 1
          }
          if (to) {
            state.changeOrder[to as keyof InitialState['changeOrder']] += 1
          }
          break
        case 'refund':
          if (from && state.refundOrder[from as keyof InitialState['refundOrder']] > 0) {
            state.refundOrder[from as keyof InitialState['refundOrder']] -= 1
          }
          if (to) {
            state.refundOrder[to as keyof InitialState['refundOrder']] += 1
          }
          break
        case 'auxiliary':
          if (from && state.auxiliaryOrder[from as keyof InitialState['auxiliaryOrder']] > 0) {
            state.auxiliaryOrder[from as keyof InitialState['auxiliaryOrder']] -= 1
          }
          if (to) {
            state.auxiliaryOrder[to as keyof InitialState['auxiliaryOrder']] += 1
          }
          break
      }
    },
    setNotifyList(state,action: PayloadAction<InotifyList>){
      state.notifyList.push(action.payload)
    },
    setNotifyVisible(state,action: PayloadAction<boolean>){
      state.notifyVisible = action.payload
    }
  }
})

export const { initAllOrders, setNotifyList, setOrderNumber, setNotifyVisible } = menuSlice.actions
export const selectMenuInfo = (state: RootState) => state.menuInfo

export const calculateOrderTotal = (orders: Record<string, number>): number => {
  return Object.values(orders).reduce((sum, count) => sum + (count || 0), 0)
}

export const selectOrderAll = createSelector(
  [selectMenuInfo],
  (menuState) => ({
    ticketOrderTotal: calculateOrderTotal(menuState.ticketOrder) || 0,
    changeOrderTotal: calculateOrderTotal(menuState.changeOrder) || 0,
    refundOrderTotal: calculateOrderTotal(menuState.refundOrder) || 0,
    auxiliaryOrderTotal: calculateOrderTotal(menuState.auxiliaryOrder) || 0
  })
)

export const notifyListSort = createSelector(
  [selectMenuInfo],
  menuState => [...menuState.notifyList].sort((a, b) => b.time - a.time)
)

// 导出类型，方便在其他模块复用（例如组件中的 useMemo 注解）
export type OrderCounts = InitialState['ticketOrder'|'changeOrder'|'refundOrder'|'auxiliaryOrder']

export default menuSlice.reducer
