import type {
  BookingStatus, ChangeStatus,
  IAuxiliaryStatus, IAuxiliaryStatusBooking,
  IChangeStatus,
  IRefundStatus,
  ITicketStatus, RefundStatus,
  VoidingStatus
} from "@/types/order.ts";

export const paymentTypeArr = [
  'orderPaying', 'rejectTicket', 'orderVoided', 'orderRefund', 'rejectRefund', 'orderChange', 'rejectChange', 'compensatory', 'assistIncome', 'assistOutlay', 'reCommission', 'otherReasons'
]
export const resultTypeArr = ['normal', 'teamed']
export const statusArr = ['pending','approved','rejected']
export const changedTypeArr = ['income','outlay']
export const passengerIdTypeArr = {
  'pp': 'passport',
  'ni': 'nationalID',
  'bd': 'birthCertificate'
} as const
export const passengerTypesArr = ['adt','chd','inf']
export const passengerSexTypeArr = {
  m: 'male',
  f: 'female'
}
export const sourceTypeTypes = {
  manual: 'Manual',
  webApi: 'WebApi',
  'import':'Import',
  invoke:'Invoke',
  restful:'Restful',
  workers:'Workers',
} as const;

export const itineraryArr = [
  {label:'Round-trip',value:'round'},
  {label:'One-way',value:'oneWay'},
  {label:'Multi-city',value:'multi'}
]
export const cabinLevelArr = {
  y:'cabinLevelY',
  c:'cabinLevelC',
  f:'cabinLevelF',
}

export const titleArr = ['Mr','Mrs','Ms','Master','Miss']

export const attachTypeArr = ['luggage', 'documents', 'seat', 'meal', 'insurance', 'otherType']

export const statusTicketArs:Record<ITicketStatus, string> = {
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
} as const


export const statusRefundArs:Record<IRefundStatus, string> = {
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
  cancelled:'routerRefundCancelled',
} as const

export const statusChangeArs:Record<IChangeStatus, string> = {
  created:'routerChangeCreated',
  confirming:'routerChangeConfirming',
  confirmed:'routerChangeConfirmed',
  changePaid:'routerChangeChangePaid',
  changing:'routerChangeChanging',
  processing:'routerChangeProcessing',
  switching:'routerChangeSwitching',
  following:'routerChangeFollowing',
  changed:'routerChangeChanged',
  completed:'routerChangeCompleted',
  cancelled:'routerChangeCancelled',
} as const

export const statusAuxiliaryArs:Record<IAuxiliaryStatus, string> = {
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
  cancelled:'routerAuxiliaryCancelled',
} as const

export const statusBookingTicket:Record<BookingStatus, string> = {
  created:'routerBookingCreated',
  bookingPaid:'routerBookingBookingPaid',
  ticketing:'routerBookingTicketing',
  processing:'routerBookingProcessing',
  switching:'routerBookingSwitching',
  following:'routerBookingFollowing',
  ticketed:'routerBookingTicketed',
  completed:'routerBookingCompleted',
  cancelled:'routerBookingCancelled'
} as const

export const statusBookingVoided:Record<VoidingStatus, string> = {
  created:'routerBookingVoidedCreated',
  voideding:'routerBookingVoidedVoideding',
  submitted:'routerBookingVoidedSubmitted',
  processing:'routerBookingVoidedProcessing',
  switching:'routerBookingVoidedSwitching',
  following:'routerBookingVoidedFollowing',
  voideded:'routerBookingVoidedVoideded',
  completed:'routerBookingVoidedCompleted',
  cancelled:'routerBookingVoidedCancelled'
} as const
export const statusBookingRefund:Record<RefundStatus, string> = {
  created:'routerBookingRefundCreated',
  refunding:'routerBookingRefundRefunding',
  submitted:'routerBookingRefundSubmitted',
  processing:'routerBookingRefundProcessing',
  switching:'routerBookingRefundSwitching',
  following:'routerBookingRefundFollowing',
  refunded:'routerBookingRefundRefunded',
  completed:'routerBookingRefundCompleted',
  cancelled:'routerBookingRefundCancelled'
} as const
export const statusBookingChange:Record<ChangeStatus, string> = {
  created:'routerBookingChangeCreated',
  changing:'routerBookingChangeChanging',
  submitted:'routerBookingChangeSubmitted',
  processing:'routerBookingChangeProcessing',
  switching:'routerBookingChangeSwitching',
  following:'routerBookingChangeFollowing',
  changed:'routerBookingChangeChanged',
  completed:'routerBookingChangeCompleted',
  cancelled:'routerBookingChangeCancelled'
} as const
export const statusBookingAuxiliary:Record<IAuxiliaryStatusBooking, string> = {
  created:'routerAuxiliaryCreated',
  attaching:'routerAuxiliaryAttaching',
  submitted:'routerAuxiliarySubmitted',
  processing:'routerAuxiliaryProcessing',
  switching:'routerAuxiliarySwitching',
  following:'routerAuxiliaryFollowing',
  attached:'routerAuxiliaryAttached',
  completed:'routerAuxiliaryCompleted',
  cancelled:'routerAuxiliaryCancelled'
} as const
