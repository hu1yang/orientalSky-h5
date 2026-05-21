import type {IAuxiliaryStatus, IChangeStatus, IRefundStatus, ITicketStatus, Passenger} from "@/types/order.ts";
import type {Amount} from "@/types/group.ts";

export function calculateTotalPriceByPassengers(passengers: Passenger[], amounts: (Amount& {
  bookingAmounts?: Amount[]
  bookingItineraryId?: string
})[]): number {
  const countMap = passengers.reduce(
    (acc, p) => {
      acc[p.passengerType] += 1;
      return acc;
    },
    { adt: 0, chd: 0, inf: 0 }
  );

  const total = amounts.reduce((sum, amount) => {
    const count = countMap[amount.passengerType as 'adt' | 'chd' | 'inf'] || 0;
    const price = (Number(amount.printAmount) || 0) + (Number(amount.taxesAmount) || 0);
    const subtotal = Math.round(price * count * 100) / 100; // 这里是关键
    return sum + subtotal;
  }, 0);

  return Math.round(total * 100) / 100; // 最终总价再处理一遍
}



export const statusArs: Record<ITicketStatus, string> = {
  created:'routerTicketCreated',
  confirming:'routerTicketConfirming',
  confirmed:'routerTicketConfirmed',
  userPaid:'routerTicketUserPaid',
  ticketing:'routerTicketTicketing',
  processing:'routerTicketProcessing',
  switching:'routerTicketSwitching',
  following:'routerTicketFollowing',
  ticketed:'routerTicketTicketed',
  completed:'routerTicketCompleted',
  cancelled:'routerTicketCancelled'
}

export const statusArsRefund: Record<IRefundStatus, string> = {
  created:'routerRefundCreated',
  confirming:'routerRefundConfirming',
  confirmed:'routerRefundConfirmed',
  executed:'routerRefundExecuted',
  refunding:'routerRefundRefunding',
  processing:'routerRefundProcessing',
  following:'routerRefundSwitching',
  switching:'routerRefundFollowing',
  refunded:'routerRefundRefunded',
  refundPaid:'routerRefundRefundPaid',
  completed:'routerRefundCompleted',
  cancelled:'routerRefundCancelled'
}
export const statusArsChange: Record<IChangeStatus, string> = {
  created:'routerChangeCreated',
  confirming:'routerChangeConfirming',
  confirmed:'routerChangeConfirmed',
  changePaid:'routerChangeChangePaid',
  changing:'routerChangeChanging',
  processing:'routerChangeProcessing',
  following:'routerChangeSwitching',
  switching:'routerChangeFollowing',
  changed:'routerChangeChanged',
  completed:'routerChangeCompleted',
  cancelled:'routerChangeCancelled'
}

export const statusArsAuxiliary: Record<IAuxiliaryStatus, string> = {
  created:'routerAuxiliaryCreated',
  confirming:'routerAuxiliaryConfirming',
  confirmed:'routerAuxiliaryConfirmed',
  appendPaid:'routerAuxiliaryAppendPaid',
  attaching:'routerAuxiliaryAttaching',
  processing:'routerAuxiliaryProcessing',
  switching:'routerAuxiliarySwitching',
  following:'routerAuxiliaryFollowing',
  attached:'routerAuxiliaryAttached',
  completed:'routerAuxiliaryCompleted',
  cancelled:'routerAuxiliaryCancelled'
}
