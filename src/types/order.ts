import type {ExpandsSetting, IExchangeRateAgent} from "@/types/agent.ts";
import type {
    AccountReceipt,
    Amount,
    BookingPayment,
    CabinLevel, CommonResponseGroup,
    ItineraryType, RequestData,
    ResponseItinerary,
    Segment
} from "@/types/group.ts";

type ISourceType = 'manual'| 'webApi'|'import' | 'invoke' | 'restful' | 'workers' | null | unknown
export type ITravelerType =  'adt'| 'chd'| 'inf'
type IPassengerIdType =  'pp'| 'ni'| 'bd'
export type ITravelerSex = 'm'| 'f'
export type ITicketStatus =
    'created'
    | 'confirming'
    | 'confirmed'
    | 'userPaid'
    | 'ticketing'
    | 'processing'
    | 'switching'
    | 'following'
    | 'ticketed'
    | 'completed'
    | 'cancelled'

export type IRefundStatus =
    'created'
    | 'confirming'
    | 'confirmed'
    | 'executed'
    | 'refunding'
    | 'processing'
    | 'following'
    | 'switching'
    | 'refunded'
    | 'refundPaid'
    | 'completed'
    | 'cancelled'
export type IChangeStatus =
    'created'
    | 'confirming'
    | 'confirmed'
    | 'changePaid'
    | 'changing'
    | 'processing'
    | 'following'
    | 'switching'
    | 'changed'
    | 'completed'
    | 'cancelled'
export type BookingStatus =
    | 'created'
    | 'bookingPaid'
    | 'ticketing'
    | 'processing'
    | 'switching'
    | 'following'
    | 'ticketed'
    | 'completed'
    | 'cancelled'
export type VoidingStatus =
    | 'created'
    | 'voideding'
    | 'submitted'
    | 'processing'
    | 'switching'
    | 'following'
    | 'voideded'
    | 'completed'
    | 'cancelled'
export type RefundStatus =
    | 'created'
    | 'refunding'
    | 'submitted'
    | 'processing'
    | 'switching'
    | 'following'
    | 'refunded'
    | 'completed'
    | 'cancelled'
export type ChangeStatus =
    | 'created'
    | 'changing'
    | 'submitted'
    | 'processing'
    | 'switching'
    | 'following'
    | 'changed'
    | 'completed'
    | 'cancelled'

export type IAuxiliaryStatus =
    | 'created'
    | 'confirming'
    | 'confirmed'
    | 'appendPaid'
    | 'attaching'
    | 'processing'
    | 'switching'
    | 'following'
    | 'attached'
    | 'completed'
    | 'cancelled'

export type IAuxiliaryStatusBooking =
    | 'created'
    | 'attaching'
    | 'submitted'
    | 'processing'
    | 'switching'
    | 'following'
    | 'attached'
    | 'completed'
    | 'cancelled'

export type IOrderManualSearchForm = {
    teamedKey?: string
    searchKey?:string
    branchId?: string
    agentId?: string
    bookingOrderId?: string
    shuttleNumber: string|null
    bookingNumber: string|null
    flightNumber: string|null
    id: string
    linkedNumber: string|null
    lockedBy?: string|null
    operator?: string|null
    creator?: string
    travelerName: string
    travelerIdNo: string
    travelerType: ITravelerType|null
    travelerSex:ITravelerSex|null
    travelerCountry: string
    isLockedBy: boolean|null
    minTime: string
    maxTime: string
    minTLimit: string
    maxTLimit: string
    status: ITicketStatus | null
    sourceType: ISourceType
    carrier:string
    ticketNumber:string
    minTravelTime:string
    maxTravelTime:string
    resultType:'normal'| 'teamed'|unknown
    departureAirport:string
    arrivalAirport:string
}
export type IOrderRefundSearchForm =
    Pick<IOrderManualSearchForm, 'shuttleNumber' | 'id' | 'operator' | 'creator' | 'minTime' | 'maxTime' | 'sourceType'|'bookingNumber' >
    & {
    orderId?: string
    minRLimit:string|Date
    maxRLimit:string|Date
    status: IRefundStatus|null
    agentId?: string
    branchId?: string
    lockedBy?: string
    isLockedBy?: string | boolean
    carrier:string
}

export type IAttachType = 'luggage'|'documents'|'seat'|'meal'|'insurance'|'otherType'


export type AuxiliaryForm = {
    orderId:string
    isConfirmed:boolean
    shuttleNumber:string
    remarks:string
    aLimit:string
    subAttachTypes:{
        type:IAttachType
        attachNotes:string[] | string
        passengerNames:string[]
        flightNumbers:string[]
    }[]
}

export type IOrderAuxiliarySearchForm = Pick<IOrderRefundSearchForm, 'shuttleNumber'|'agentId'|'orderId'|'branchId'|'id'|'lockedBy'|'operator'|'creator'|'isLockedBy'|'minTime'|'maxTime'|'sourceType'|'bookingNumber'> & {
    channelCode:''
    attachType:IAttachType|null
    status:IAuxiliaryStatus|null
}
export type IOrderAuxiliaryCount = {
    count: number,
    items: IOrderAuxiliary[]
}

export type IOrderAuxiliaryConfirmed = {
    id:string
    currency:string
    laborServiceFees:string|number
    netPaymentAmount:string|number
    exchangeRate:string|number
    remarks:string
    operator:string
    creator:string
    updatedTime:string
    createdTime:string
}

export type IAppendForAttachTypes = {
    type:IAttachType
    attachNotes:string[],
    passengerNames:string[]|null
    flightNumbers:string[]|null
    result:string|null
}

export type IOrderAuxiliary = Pick<IOrderRefund, 'agentCode'|'branchCode'|'id'|'orderId'|'shuttleNumber'|'remarks'|'message'|'lockedBy'|'operator'|'creator'|'sourceType'|'updatedTime'|'createdTime'|'expandSettings'|'order'|'replenishLogs'> & {
    isConfirmed:boolean
    aLimit:string
    status:IAuxiliaryStatus
    appendOfSupportings:AccountReceipt[]
    appendTradePayments:{
        id: string
        appendId: string
        paymentId: string
        time: string
    }[]
    appendForAttachTypes:IAppendForAttachTypes[]
    confirmed?:IOrderAuxiliaryConfirmed|null
}

export type IBookingAuxiliary = Pick<BookingPayment, 'currency'|'balance'|'transactionId'|'id'|'remarks'|'operator'|'creator'|'updatedTime'|'createdTime'|'exchangeRate'> & {
    appendNumber: string
    bookingOrderId: string
    status: IAuxiliaryStatusBooking
    message: string,
    sourceType: ISourceType,
    amounts: IAmounts[]
    appendAttachTypes:{
        type:IAttachType
        attachNotes:string[]
        passengerNames:string[]
        flightNumbers:string[]
    }[]
    isVoluntary:boolean
    totalAmount:string
    exchangeRate:string
}

export type IOrderChangeSearchForm = Pick<IOrderManualSearchForm, 'shuttleNumber' | 'id' | 'operator' | 'creator' | 'minTime'| 'ticketNumber' | 'maxTime' | 'sourceType' | 'carrier'|'bookingNumber'>
    & {
    orderId?: string
    minCLimit: string | Date
    maxCLimit: string | Date
    status: IChangeStatus | null
    agentId?: string
    branchId?: string
    lockedBy?: string
    isLockedBy?: string | boolean
}

export interface Itinerary extends ResponseItinerary {
    id: string
    orderId: string
    bookingItineraryId?: string
}

export interface TicketNumber {
    fullName?: string
    idNumber?: string
    itineraryNo: number|null
    sequenceNos: number[]
    ticketNotes: string
    ticketNumber: string
    id: string
    subPassengerId?: string
    remarks?: string|null
    operator?: string|null
    creator?: string
    updatedTime?: string
    createdTime?: string
    hasPassengerId?: string
    bookingNumber?: string|null
    changeNumber?: string
}
export type ITitle = 'Mr'|'Mrs'|'Ms'|'Master'|'Miss'
export interface Passenger {
    title: ITitle|''
    fullName: string
    idNumber: string
    idCountry: string
    trCountry: string
    issuedDate: string
    birthday: string
    expiryDate: string
    phoneNumber: string|null
    emailAddress: string
    passengerIdType: IPassengerIdType
    passengerType: ITravelerType
    passengerSexType: ITravelerSex
    id: string
    orderId: string
    ticketNumbers: TicketNumber[]
    bookingPassengerId?: string
}

export type ExchangeRate = IExchangeRateAgent & {
    publishTime: string
    englishName: string|null
    chineseName: string|null
}
export interface Contact {
    contactName:string
    phoneNumber: string|null
    emailAddress: string
}

export interface ReplenishLogs {
    id: string;
    orderId: string;
    refundId: string;
    changeId: string;
    appendId: string;
    remarks: string;
    isAgented: boolean;
    creator: string;
    time: string;
}

export interface IOrderManual {
    branchCode?: string
    agentCode?:string
    agentId: string
    branchId: string
    id: string
    shuttleNumber: string|null
    linkedNumber: string|null
    channelCode: string
    status: ITicketStatus|IRefundStatus|IChangeStatus
    tLimit: string|Date|null
    sourceType: ISourceType
    remarks: string|null
    message: string|null
    lockedBy: string|null
    operator: string|null
    creator: string
    resultType:'normal'|'teamed'
    updatedTime: string
    createdTime: string
    currency: string
    exchangeRate: number
    sourceRate: ExchangeRate
    targetRate: ExchangeRate
    passengers: Passenger[]
    itineraries: Itinerary[]
    contacts: (Contact & {
        id?:string|null
        orderId?:string|null
    })[]
    request: RequestData
    policies: IPolicies[]
    teamedKey?: string
    channelResult:{
        teamedKey?: string
    }
    replenishLogs:ReplenishLogs[]
}

export type IOrderManualCount = {
    count: number,
    items: IOrderManual[]
}

export type IItineraries = Omit<ResponseItinerary, 'itineraryKey'|'amounts'>

export type PassengerS = Omit<Passenger, 'id'|'orderId'|'ticketNumbers'>

export type IPassengerForm = (PassengerS & {
    firstName?: string
    lastName?: string
})

export type IOrderManualForm = {
    shuttleNumber: string|null
    channelCode: string|null
    remarks: string|null
    tLimit: string|Date|null
    resultType:'normal'|'teamed'
    passengers: IPassengerForm[]
    contacts: Contact[]
    itineraries: IItineraries[]
}

export type IOrderRefund = Omit<IOrderManual, 'agentId'|'branchId'|'linkedNumber'|'tLimit'|'currency'|'exchangeRate'|'sourceRate'|'targetRate'|'passengers'|'itineraries'|'contacts'> & {
    orderId: string
    rLimit?:null|string
    refundForPassengers:{
        id: string
        refundId: string
        subPassengerId: string
    }[]
    refundForItineraries:{
        id: string
        refundId: string
        subItineraryId:string
        flightNumbers:string[]
    }[]

    refundTradePayments?:{
        id: string
        refundId: string
        paymentId: string
    }[]
    status: IRefundStatus
    order?: IOrderManual & {
        passengers: Passenger[]
        expandSettings?: (ExpandsSetting & {
            time: string|Date
        })[];
        resultType:'normal'|'teamed'
        currency: string
    }
    confirmed?: null|IConfirmed
    expandSettings?: (ExpandsSetting & {
        time: string|Date
    })[];
    refundOfSupportings:AccountReceipt[]
    isVoluntary:boolean
}

export type IOrderRefundCount = {
    count: number,
    items: IOrderRefund[]
}

export type ISubItineraries = {
    subItineraryId:string
    flightNumbers:string[]
}

export type IOrderRefundForm = {
    orderId: string
    remarks: string|null
    shuttleNumber: string|null
    rLimit: string|Date
    subPassengerIds: string[]
    isVoluntary: boolean
    subItineraries: ISubItineraries[]
}

export type IChangeForPassengers = {
    id:string
    changeId: string
    subPassengerId: string
    ticketNumbers: TicketNumber[]
}

export type IOrderChange = Omit<IOrderRefund, 'refundForPassengers'|'refundForItineraries'> & {
    changeForPassengers: IChangeForPassengers[]
    changeForItineraries: (Omit<ResponseItinerary, 'amounts'> & {
        id?: string
        changeId?: string
        itineraryKey?: string
    })[]
}
export type IOrderChangeCount = {
    count: number,
    items: IOrderChange[]
}
export type IOrderChangeForm = Omit<IOrderRefundForm, 'rLimit'|'subItineraries'> & {
    cLimit: string|Date
    newItineraries: IItineraries[]
}

export interface IAmounts{
    itineraryNo:number|string
    sequenceNos: number[]
    fullName: string
    idNumber: string
    netServiceFees: number|string
    netRefundAmount?: number|string
    netChangeAmount?: number|string
    deductionAmount: number|string
    othersNotes: string[]|string
}
export interface IConfirmed{
    id:string
    currency: string
    sourceRate: ExchangeRate
    targetRate: ExchangeRate
    laborServiceFees: number|string
    exchangeRate: number|string
    remarks: string|null
    operator: string|null
    creator: string
    updatedTime: string
    createdTime: string
    amounts:IAmounts[]
}
export type IRefund = IOrderRefund & {
    isVoluntary:boolean
}

export type IChange = Omit<IRefund, 'refundForItineraries'|'refundForPassengers'|'status'> & {
    changeForPassengers: IChangeForPassengers[]
    changeForItineraries: (Omit<ResponseItinerary, 'itineraryKey'|'amounts'> & {
        subItineraryId:string
        id:string
        changeId:string
    })[]
    changeOfSupportings:AccountReceipt[]
    status:IChangeStatus
}


export interface HasItinerary{
    id: string
    bookingOrderId: string
    subItineraryId: string
    amounts:(Amount & {
        id: string
        hasItineraryId: string
    })[]
}
export interface HasPassenger{
    id: string
    bookingOrderId: string
    subPassengerId: string
    ticketNumbers: TicketNumber[]
}

export type IBookingVoided = {
    currency: string
    netServiceFees: number|string
    netVoidedAmount: number|string
    deductionAmount: number|string
    othersNotes: string[]|string
    voidedNumber: string
    balance: number|string
    transactionId: string
    id: string
    bookingOrderId: string
    status: VoidingStatus
    remarks: string
    message: string
    operator: string
    creator: string
    sourceType: Exclude<ISourceType,'restful'> // 根据业务扩展
    updatedTime: string
    createdTime: string
    exchangeRate: number|string
}
export type IItinerariesAll = IItineraries & {
    amounts: BookChangeAmount[]
}
export type BookChangeAmount = Pick<IAmounts, 'fullName'|'idNumber'|'netServiceFees'|'netChangeAmount'|'deductionAmount'|'othersNotes'>
export type IBookingChange = Pick<BookingPayment, 'currency'|'balance'|'transactionId'|'id'|'remarks'|'operator'|'creator'|'updatedTime'|'createdTime'|'exchangeRate'> & {
    changeNumber: string
    bookingOrderId: string
    status: ChangeStatus
    message: string,
    sourceType: Exclude<ISourceType,'restful'>,
    amounts: IAmounts[]
    changePassengers:(Omit<HasPassenger, 'bookingOrderId'|'subPassengerId'> & {
        bookingChangeId: string
        hasPassengerId: string
    })[]
    changeItineraries: (Omit<ResponseItinerary, 'subItineraryId'|'amounts'> & {
        amounts: BookChangeAmount[]
    })[]
    isVoluntary:boolean
    totalAmount: string
}

export type IBookingRefund = Omit<IBookingVoided, 'netServiceFees'|'netVoidedAmount'|'deductionAmount'|'othersNotes'|'voidedNumber'|'status'> & {
    amounts:IAmounts[]
    status: RefundStatus
    refundNumber: string
    refundPassengers:{
        id: string
        bookingRefundId: string
        hasPassengerId: string
    }[]
    refundItineraries:{
        id: string
        bookingRefundId: string
        hasItineraryId: string
        flightNumbers:string[]
    }[]
    isVoluntary:boolean
}

export interface BookingOrder{
    currency: string;
    printAmount: number|string;
    taxesAmount: number|string;
    bookingNumber: string;
    id: string;
    bookingPolicies:IPolicies[]
    orderId: string;
    status: BookingStatus;
    message: string|null;
    remarks: string;
    resultType:'normal'|'teamed'
    operator: string|null;
    creator: string;
    sourceType: string;
    updatedTime: string;
    createdTime: string;
    channelCode: string;
    exchangeRate: number|unknown;
    accountName: string;
    paymentName: string;
    order?: {
        exchangeRate?: number
        currency?: string;
    };
    hasItineraries: HasItinerary[];
    hasPassengers: HasPassenger[];
    bookingRefunds: IBookingRefund[];  // 你也可以继续展开 Refund、Change、Voided 等结构
    bookingChanges: IBookingChange[];
    bookingVoideds: IBookingVoided[];
    expandSettings: (ExpandsSetting & {
        time: string|Date
    })[];
    byBranchId:string|null
}


export interface UpOrderAmounts{
    orderId?: string|null
    bookingOrderId?:string|null
    exchangeRate?:number|string|null
    message:string
    currency?:string
    itineraries:{
        itineraryNo?: string|number|null
        amounts:Amount[]
    }[]
}

export type AmountRC = Omit<IAmounts, 'itineraryNo'|'sequenceNos'>

export type UpOrderRCAmounts = Pick<IConfirmed, 'currency'|'exchangeRate'|'remarks'|'laborServiceFees'> & {
    amounts: AmountRC[]
    changeId: string
    refundId: string
    sureNow?:boolean|null
}

export type UpOrderAppendAmounts = {
    appendId: string
    remarks: string
    netPaymentAmount:number|string
    laborServiceFees:number|string
}

export type ISubItineraryId = {
    subItineraryId:string,
    amounts:Amount[]
}
export type BookingAddForm = Pick<BookingOrder, 'currency'|'printAmount'|'taxesAmount'|'bookingNumber'|'channelCode'|'accountName'|'remarks'|'exchangeRate'|'resultType'> & {
    subPassengerIds: string[]
    subItineraries: ISubItineraryId[]
}


export type TicketNumberForm = Pick<TicketNumber, 'ticketNotes'|'itineraryNo'|'sequenceNos'|'ticketNumber'|'bookingNumber'|'changeNumber'>


export type BookingVoidedForm = Pick<IBookingVoided, 'currency'|'netServiceFees'|'netVoidedAmount'|'netVoidedAmount'|'deductionAmount'|'othersNotes'|'voidedNumber'|'balance'|'transactionId'|'remarks'|'exchangeRate'>
export type BookingRefundForm = Pick<IBookingRefund, 'currency'|'amounts'|'refundNumber'|'balance'|'transactionId'|'exchangeRate'|'remarks'> & {
    hasPassengerIds: string[]
    hasItineraries: {
        hasItineraryId:string,
        flightNumbers:string[]
    }[]
    isVoluntary: boolean
}
export type BookingChangeForm = Omit<BookingRefundForm,'refundNumber'|'hasItineraries'|'amounts'> & {
    changeNumber: string,
    newItineraries: {
        hasItineraryId: string
        flightNumbers:string[]
        amounts:IAmounts[]
        segments: Segment[]
    }[]
    isVoluntary: boolean
    totalAmount: string
}

export type BookingAuxiliaryForm = Pick<IBookingAuxiliary, 'appendNumber'|'remarks'|'currency'|'transactionId'|'balance'> & {
    totalAmount: string
    hasAttachTypes:{
        type:IAttachType
        attachNotes:string[]|string
        passengerNames:string[]
        flightNumbers:string[]
    }[]
}


export type BookingQuoteSearch = {
    channelCodes: string[]
    itineraryType: ItineraryType
    cabinLevel: CabinLevel
    passengerIds: string[]
    itineraryIds: string[]
    byBranchId:string
}

export interface IPolicies {
    id: string
    orderId: string
    policyId: string
    policyType: 'quote'|'teamed'
    discount: string|number
    familyCode: string
    itineraryKey: string
}
export type IPatterns = {
    policyId:string
    policyType:'quote'|'teamed'
    discount:string|null
    familyCode:string
    itineraryKey:number|string
}
export interface Result {
    contextId: string
    resultType:'normal'|'teamed'
    currency: string
    resultKey: string
    itineraries: ResponseItinerary[]
    teamedKey: string|null
    patterns: IPatterns[]
}

export interface ResponseData {
    channelCode: string
    updatedTime: string
    isFromCaching: boolean
    results: Result[]
}

export interface FQueryResult {
    succeed: boolean
    errorCode: string | null
    errorMessage: string | null
    response: ResponseData
}
export interface IFlattenData {
    channelCode: string
    contextId: string
    currency: string;
    itineraryKey: string
    itineraryNo: number;
    patterns: IPatterns[]
    resultKey: string;
    resultType:'normal'|'teamed'
    segments: Segment[]
    teamedKey: string|null
    amount: Amount;
}

export interface QueryResultCreate {
    channelCode: string
    passengerIds:string[]
    itineraryIds: string[]
    result: Result|null
}

export type CombinationResult = Result & {
    channelCode: string
}

export type AirSearchData = {
    combinationKey: string
    combinationResult: CombinationResult[]
}
export interface ChannelResult{
    channelCode: string
    result: AirSearchData[]
}
export interface AirChoose{
    result: Result | null
    channelCode: string
}

export type LostPriceAmout = {
    minTotal: number
    amounts: Amount[]
}

export interface GetAirResultListParams {
    airSearchData: AirSearchData[];
    airportActived: number;
    airChoose: AirChoose
}

export type ComboItem = {
    amount: Amount;
    itineraryNo: number;
    familyCode: string;
    channelCode: string;
    resultKey: string;
    currency: string;
    sourceItem: CombinationResult;
};


export interface IResult{
    key: string
    segments: Segment[]
    currency: string
    itineraryKey: string
    amountsMemo: ComboItem[]
}

export interface QueryGlobalAirports {
    countryEName: string,
    countryCName: string,
    countryCode: string,
    timeZone: number,
    cityEName: string,
    cityCName: string,
    cityCode: string,
    airports:  {
        airportEName: string,
        airportCName: string,
        airportCode: string
    }[]
}

export interface IPushNotify {
    message?:string
    notifyType?: 'notifyMessage'| 'flightRejected'| 'flightDelayed'| 'flightCancelled'
    isVisible?: boolean
    remarks?:''
}

export interface AppendReplenishLogForm {
    remarks:string
    orderType:string
}

export interface InotifyList {
    broadcastId: string
    messageBody:string
    properties:{
        OrderId?:string
        ChannelBalanceId?:string
        PaymentId?:string
        Fromstatus?:string
        Tostatus?:string
        OrderType?: string
        AgentId?: string
        id?:string
        AccountId?:string
    },
    type:'agentPayment'|'order'|'channel'|'agent'|'channelPayment'|'channelAccount',
    time:number
}


export interface PurchaseRefund{
    hasPassengerIds:string[]
    isVoluntary:boolean
    hasItineraries:{
        hasItineraryId:string
        flightNumbers:string[]
    }[]
}

export type PurchaseRefundResponseGroup = Pick<CommonResponseGroup, 'succeed'|'message'> & {
    content:{
        currency:string
        amounts:AmountRC[]
    }
}


export type BookingData = {
    orderId:string
    isVoluntary:boolean
    passengers:string[]
    itineraries: { hasItineraryId: string, flightNumbers: string[] }[]
}

export type CommonResponseOrderContent = {
    bookingNumber:string
    status:'unknown'| 'booked'| 'ticketed'| 'cancelled'| 'byother'
    passengers: (Omit<Passenger, 'ticketNumbers'> & {
        ticketNumbers:{
            ticketNotes: string
            ticketNumber:string
            status:'unknown'| 'open'| 'flown'| 'void'| 'refund'| 'exchanged'| 'cancelled'| 'checkin'| 'boarded'| 'suspended'| 'noshow'| 'expired'| 'byother'
        }[]
    })[]
    segments: Segment[]
    contacts: Contact[]
    properties:{
        value:string
        name:string
    }[]
}
export type CommonResponseOrder = {
    succeed:boolean
    message:string
    content:CommonResponseOrderContent
}
export type AppendResult = {
    resultType:IAttachType
    flightNumbers:string[]
    passengerNames:string[]
    descriptions:string[]
    resultKey:string
    resultName:string
    perPaymentAmount:number
    expandsSettings: {
        value:string
        name:string
    }[]
}
export type AppendConsult = {
    succeed:boolean
    message:string
    content:{
        currency:string
        results:AppendResult[]
    }
}
export type ISeekType = {
    flightNumbers:string[]
    passengerNames:string[]
    type:IAttachType
}
export type AppendConsultForm = ISeekType & {
    seekTypes:ISeekType[]
    currency:string
    selecteds:{
        passengerNames:string[]
        flightNumbers:string[]
        result:AppendResult
    }[]
}

export type OrderNum = {
    order:number
    refund:number
    change:number
    append:number
}
