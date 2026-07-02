import type {AssemblyData} from "@/types/identity.ts";
import type {
    AddAgentSettingForm,
    AgentSetting, CancelAgentPaymentAgent,
    ChangedType, DataAccessersAgent, FeessSetting,
    ISearchPayMentForm,
    PaymentType, PushProvider,
    ScaleSetting, TopupSettings,
    TradeRecord
} from "@/types/agent.ts";

type LuggageType =  'carry'| 'hand'| 'checked'|unknown
type LuggageSizeType =  'pc'| 'kg'| 'lb'|unknown
type PassengerType =  'adt'| 'chd'| 'inf'
export type ItineraryType = 'oneWay'| 'round'| 'multi'

export type IPageInfo = {
    page:number;
    pageSize:number;
    lastPage?:boolean;
    count?:number;
}

export type GroupAssemblyData = AssemblyData;

export type ISourceType = 'manual'| 'webApi'| 'import' | 'invoke' | 'restful' | 'workers'


export type CabinLevel = 'y'| 'c'| 'f'


export interface IContent {
    beforeBalance: number
    currentBalance: number
    agentAccountId: string
    tradePaymentId: string
    agentAccount: GroupBalance
    tradePayment: Omit<BookingPayment, 'accountName'|'bookingNumber'|'balance'|'bookingHistory'>&{
        agentId: string
        orderNumber: string
        reconciled: boolean
        sourceType:ISourceType;
        tradeHistory: string
    }
    time: string
}

export interface CommonResponseGroup {
    succeed: boolean;
    message: string;
    content?: null|string|IContent
}
export type VoidCommonResponseGroup = CommonResponseGroup & {
    content?:{
        currency:string
        netServiceFees: number
        netVoidedAmount: number
        deductionAmount: number
        othersNotes: string[]
    }
}

export interface ExpandsSetting {
    indexId: string;
    value: string;
    name: string;
}

export interface GroupBalance{
    id: string;
    branchId: string;
    agentId: string;
    isLocked:boolean;
    currency: string;
    balance:string|number;
    operator: string;
    updatedTime: string;
    createdTime: string;
    expandSettings: ExpandsSetting[];
    lessBalance:string
}

export interface ISearchPayMentFormGroup extends ISearchPayMentForm{
    agentId?:string;
    branchId?:string;
    reconciled:boolean|null;
    sourceType:ISourceType|null;
}

export type TradeRecordGroup = TradeRecord
export type IStatus = 'pending' | 'reviewed' | 'confirmed' | 'rejected' | 'cancelled' | unknown

export interface ISearchRechargeForm{
    branchId:string;
    id:string;
    agentId:string;
    unLinked:boolean|null;
    status: IStatus;
    transactionId:string;
    bankAccountCode:string;
    minTime:Date|string;
    maxTime:Date|string;
    changedType:ChangedType
}


export interface AgentReceipt {
    id: string
    agentPaymentId: string
    isAgented: boolean
    fileSize: number
    fileName: string
    fileType: string
    remarks: string
    creator: string
    time: string // ISO 时间字符串
}

export interface AgentHistory {
    beforeBalance: number
    currentBalance: number
    agentAccountId: string
    agentPaymentId: string
    time: string
}

export type RevokeAgentPaymentGroup = Omit<AgentHistory, 'beforeBalance'|'currentBalance'|'time'>
export type RevokeAgentPaymentFormGroup = {
    totalAmount:number|string
    remarks:string
    agentAccountId:string
    agentPaymentId:string
    transactionId?:string
}

export interface AgentPayment {
    id: string
    branchId: string
    agentId: string
    status: IStatus
    bankSwiftOrName: string
    bankAccountName: string
    bankAccountCode: string
    currency: string
    totalAmount: number|string
    exchangeRate: number
    transactionId: string
    changedType: ChangedType
    remarks: string
    operator: string
    creator: string
    updatedTime: string
    createdTime: string
    agentHistory: AgentHistory
    agentReceipts: AgentReceipt[]
}

export interface ISearchBooking {
    branchId?:string;
    id?:string;
    isEnabled?:boolean|null
    channelCode?:string;
    accountName?:string;
    groupCode?:string
}

export interface IBooking extends ISearchBooking {
    scaleLimited: number|string
    queryLimited: number|string
    remarks: string
    contactName: string
    phoneNumber: string
    emailAddress: string
    operator: string
    updatedTime: string // ISO 时间字符串
    createdTime: string // ISO 时间字符串
    paymentSettings: PaymentSetting[]
    expandSettings: ExpandsSetting[]
    scaleLimitedDaysLength:string
    groupCode?:string
    branchIds:string[]
    orderRangeAmount:number|string
    payedRangeAmount:number|string
    voidedFeesAmount:number|string
    refundFeesAmount:number|string
    changeFeesAmount:number|string
    appendFeesAmount:number|string
}

export type IChannelAccount = Omit<IBooking, 'operator'|'updatedTime'|'createdTime'|'paymentSettings'|'expandSettings'> & {
    accountCode:string;
}


export type AccountType = 'payment' | 'prepay' | 'offline' | string

export interface PaymentSetting {
    channelAccountId: string
    paymentAccountId: string
    operator: string
    channelAccount: IBooking
    paymentAccount: IPayment
    time: string // ISO 时间字符串
}

export type IPayment = Omit<ISearchBooking, 'channelCode'> & {
    lessBalance: number|string
    accountType: AccountType
    remarks: string
    contactName: string
    phoneNumber: string
    emailAddress: string
    operator: string
    updatedTime: string // ISO 时间字符串
    createdTime: string // ISO 时间字符串
    paymentSettings: PaymentSetting[]
    expandSettings: ExpandsSetting[]
    expandList?: RechargePayment[]
}

export type IPaymentForm = Omit<IPayment, 'expandSettings'|'paymentSettings'|'createdTime'|'updatedTime'|'operator'|'channelCode'> & {
    accountCode:string;
}


export type ISearchBookingPayment = {
    transactionId:string;
    id:string;
    branchId:string;
    accountName:string;
    minTime:Date|string;
    maxTime:Date|string;
    changedType:ChangedType;
    paymentType:PaymentType;

    orderNumber: string,
    reconciled: boolean|null
}


export interface BookingHistory {
    paymentAccountId: string
    bookingPaymentId: string
}

export interface BookingPayment {
    id: string
    branchId: string
    accountName: string
    bookingNumber: string
    orderNumber: string
    transactionId: string
    balance: number|string
    currency: string
    totalAmount: number
    exchangeRate: number
    changedType: ChangedType
    paymentType: PaymentType
    remarks: string
    operator: string
    creator: string
    bookingHistory: BookingHistory
    updatedTime: string // ISO 格式时间
    createdTime: string // ISO 格式时间
    reconciled:boolean
}

export type IPolicyPaymentForm = {
    id?: string
    bookingNumber?: string
    teamPolicyId?: string,
    paymentAccountId: string,
    balance: string,
    transactionId: string,
    currency: string,
    totalAmount: number|string,
    exchangeRate: number|string,
    remarks: string,
    changedType: ChangedType,
    paymentType: PaymentType
}
export type IBookingPaymentForm = IPolicyPaymentForm


export interface ReturnSoldQuantityForm {
    flightNumber: string
    orderId: string,
    cabinCode:string,
    returnQuantity: number|string,
    departureDate: string
    teamdPolicyId:string
}

export type ISearchRechargePaymentForm = Omit<ISearchRechargeForm, 'unLinked'|'agentId'> & {
    accountName:string
    accountId?: string
}

// AccountPayment interface, reusing AccountReceipt and AccountHistory
export interface AccountReceipt {
    id:string;
    accountPaymentId:string;
    fileSize:string|number
    fileName:string
    fileType:string
    remarks: string
    creator: string
    time: string|Date;
    appendId?:string;
    isAgented?:boolean;
}

export interface AccountHistory {
    paymentAccountId: string
    accountPaymentId: string
}
export interface RechargePayment {
    id: string
    branchId: string
    accountName: string
    status: IStatus
    paymentBankSwiftOrName: string
    paymentBankAccountName: string
    paymentBankAccountCode: string
    receivingBankSwiftOrName: string
    receivingBankAccountName: string
    receivingBankAccountCode: string
    balance: number|string
    currency: string
    totalAmount: number|string
    exchangeRate: number
    transactionId: string
    changedType: ChangedType
    remarks: string
    operator: string
    creator: string
    updatedTime: string|Date
    createdTime: string|Date
    accountHistory: AccountHistory;
    accountReceipts: AccountReceipt[]
}

export type RechargePaymentForm = Pick<RechargePayment, 'id'|'paymentBankSwiftOrName'|'paymentBankAccountName'|'paymentBankAccountCode'|'receivingBankSwiftOrName'|'receivingBankAccountName'|'receivingBankAccountCode'|'balance'|'currency'|'totalAmount'|'exchangeRate'|'transactionId'|'remarks'|'changedType'> & {
    paymentAccountId:string;
}

export type ConfirmationChannelForm = {
    attachAmount:string
    remarks:string
    id:string
    transactionId:string
}


export interface IExchangeRate {
    id: string;
    englishName: string;
    chineseName: string;
    currencyCode:string;
    middleRate:number;
    buyingRate:number;
    cashBuyingRate:number;
    sellingRate:number;
    cashSellingRate:number;
    operator:string;
    updatedTime:string|Date;
    publishTime:string|Date;
}

export type IExchangeRateForm = Omit<IExchangeRate, 'id'|'operator'|'updatedTime'>;


export interface IGetGlobalAirportsForm {
    countryCode:string;
    cityCode:string;
    airportCode:string;
}

export interface IAddGlobalAirportsForm extends IGetGlobalAirportsForm {
    countryEName: string
    countryCName: string
    cityEName: string
    cityCName: string
    airportEName: string
    airportCName: string
    id:string;
    timeZone:number|string
}

export interface IGetGlobalAirports {
    id: string
    countryCode: string
    countryEName: string
    countryCName: string
    cityCode: string
    cityEName: string
    cityCName: string
    airportCode: string
    airportEName: string
    airportCName: string
    timeZone:number|string
    operator: string
    updatedTime: string // ISO 时间字符串
}


export interface IWayPointsForm {
    channelCode?:string;
    iataCode:string
}

export interface IWayPoints{
    id:string;
    channelCode:string;
    travelIssuedDate:string;
    travelExpiryDate:string;
    iataCode:string;
    issuedWeeks:number[];
    operator:string;
    updatedTime:string|Date;
}

export interface IAddWayPoints extends IWayPointsForm{
    issuedWeeks:number[]|string;
    travelIssuedDate:string;
    travelExpiryDate:string;
    id?:string;
}

export type DataAccessersFormGroup = Omit<DataAccessersAgent, 'operator'|'updatedTime'|'createdTime'|'expandSettings'>
export type AgentSettingGroup = AgentSetting;
export type FeessSettingGroup = FeessSetting;
export type TopupSettingsGroup = TopupSettings;
export type TopupSettingsFormGroup = Omit<TopupSettings, 'operator'|'updatedTime'|'createdTime'>
export type PushProviderGroup = PushProvider;
export type ScaleSettingGroup = ScaleSetting;

export type ScaleSettingFormGroup = Omit<ScaleSetting, 'operator'|'updatedTime'|'createdTime'> & {
    id?: string;
    agentSettingId?: string;
}
export type PushProviderFormGroup = Omit<PushProvider, 'expandSettings'|'createdTime'|'updatedTime'|'operator'>
export type FeessSettingFormGroup = Omit<FeessSetting, 'operator'|'updatedTime'|'createdTime'>  & {
    id?: string;
    agentSettingId?: string;
}


export type AddAgentSettingFormGroup =  AddAgentSettingForm

export type ExpandsSettingFormGroup = {
    id:string;
    expandSettings:ExpandsSetting[];
}

export type InvokeProvidersGroup = Omit<PushProvider, 'agentSettingId'|'request_Url'> & {
    channelSettingId:string;
}

export type IChannelSettings = {
    id: string;
    groupId: string;
    channelCode:string;
    isEnabled:boolean;
    channelName:string;
    operator:string;
    updatedTime:string|Date;
    createdTime:string|Date;
    expandSettings:ExpandsSetting[];
    invokeProviders:InvokeProvidersGroup[]
}
export type IPayedInvokers = Pick<InvokeProvidersGroup, 'id'|'isEnabled'|'timeoutSeconds'|'operator'|'updatedTime'|'createdTime'|'expandSettings'> & {
    payedSettingId: string
    invokerType: 'create'|'query'
}

export type IChannelPayedSettings = {
    id: string
    groupId: string
    branchId: string
    branchIds: string[]
    isEnabled: boolean
    paymentCode: string
    paymentName: string
    description: string
    currencyCodes: string[]
    accountName: string
    expirationMinutes: number
    operator: string
    updatedTime: string
    createdTime: string
    expandSettings:ExpandsSetting[];
    payedInvokers: IPayedInvokers[]
}

export type ITopupPaymentsStatus = 'created'| 'pending'| 'processing'| 'finished'| 'cancelled'
export type ITopupHistory = {
    accountCurrency: string
    beforeBalance: number
    currentBalance: number
    agentAccountId: string
    topupPaymentId: string
    agentAccount: GroupBalance
}
export type ITopupPaymentsList = {
    id: string
    branchId: string
    agentId: string
    status: ITopupPaymentsStatus
    paymentCode: string
    expiration: string
    currency: string
    paymentAmount: number
    serviceAmount: number
    receivedAmount: number
    exchangeRate: number
    accountCurrency: string
    transactionId: string
    reconciled: boolean
    remarks: string
    operator: string
    creator: string
    updatedTime: string
    createdTime: string
    topupHistory: ITopupHistory
}
export type IChannelPayedSettingsSearch = Pick<ITopupPaymentsList, 'id'|'transactionId'|'paymentCode'> & {
    unLinked: boolean|null
    minTime: string
    maxTime: string
    branchId?: string
    agentId?: string
    status: ITopupPaymentsStatus|null
    reconciled: boolean|null
}

export type IPayedSettingUpdate = Pick<IChannelPayedSettings, 'id'|'branchIds'|'isEnabled'|'description'|'currencyCodes'>
export type IPayedInvokerUpdate = Pick<IChannelPayedSettings, 'id'|'isEnabled'> & {
    timeoutSeconds: number|string
}

export interface IFindBalanceAccountsForm{
    accountName: string
    isEnabled: boolean
    accountType: AccountType
}
export type IPaymentAccount = Omit<IPayment, 'lessBalance'|'paymentSettings'> & {
    paymentSettings: (Omit<PaymentSetting, 'paymentAccount'> & {
        paymentAccount: string
    })[]
}
export interface IBalanceSettings {
    channelBalanceId: string
    channelBalance: string
    paymentAccount: IPaymentAccount
    paymentAccountId: string
}
export type IBalanceAccountForm = {
    balanceId:string
    accountIds: string[]
}

export interface IChannelBalanceForm {
    id?: string
    totalBalance:number|string
    lessBalance:number|string
    groupName: string
    currency:string
}

export type IChannelSettingsBalance = Pick<IChannelSettings, 'id'|'groupId'|'operator'|'updatedTime'|'createdTime'> & {
    groupName: string
    totalBalance: number|string
    lessBalance: number|string
    balanceSettings: IBalanceSettings[]
    currency: string
}

export type AgentAccountForm = {
    branchId:string;
    agentId:string;
    id?:string;
    isLocked:boolean;
    lessBalance:number|string;
    currency?:string

}

export type CancelAgentPaymentGroup = CancelAgentPaymentAgent






export type ITeamRoutings = {
    arrival: string
    departure: string
}
export type IQuotePatterns = {
    cabinLevel: CabinLevel,
    passengerType: PassengerType,
    exceedAmount: number|string,
    lessQuantity: number|string,
    keepAmount: number|string,
    keepRebate: number|string,
    travelIssuedDate: string,
    travelExpiryDate: string
    carriers:string[]|string
    issuedWeeks:string[]
}
export interface IBranch{
    branchId?:string,
    code: string,
    name: string,
    localAddress: string,
    otherName: string,
    description: string
    country:string
}

export interface ISearchQuotePoliciesGroup {
    branchId: string,
    agentId: string,
    batchCode: string,
    id: string,
    channelCode: string,
    carrier: string,
    arrival: string,
    departure: string,
    automated: boolean|null,
    isEnabled: boolean|null,
    isExpired: boolean|null,
    minTime: string,
    maxTime: string,
    sourceType:ISourceType|null;
    operator: string,
    creator: string,
    itineraryType: ItineraryType|null;
}

export type IQuotePoliciesItem =
    Pick<ISearchQuotePoliciesGroup, 'id' | 'batchCode' | 'branchId' | 'channelCode' | 'automated'  | 'isEnabled' | 'sourceType'>
    & {
    groupId: string
    sortingId: string|number
    agentIds: string[]
    arrivals: string[]
    departures: string[]
    issuedDate: string
    expiryDate: string
    travelIssuedDate: string
    travelExpiryDate: string
    issuedWeeks: number[]
    cabinLevels: CabinLevel[]
    carriers: string[]
    bySegment: boolean|''
    keepAmount: number|string
    keepRebate: number|string
    passengerTypes: PassengerType[]
    remarks: string
    updatedTime: string
    createdTime: string
    autoToPay: boolean
    operator?: string
    creator?: string
    branchIds: string[]
    flightTypes:('oneWay'|'round'| 'multi')[]
    byDirectd:boolean|''
    cabinCodes:string[]
}
export type IQuotePoliciesGroup = {
    count:number
    items: IQuotePoliciesItem[]
}
export type IQuotePoliciesFormGroup = Pick<IQuotePoliciesItem, 'id'|'channelCode' | 'branchIds' | 'flightTypes' | 'cabinLevels' | 'arrivals' | 'departures' | 'issuedDate' | 'expiryDate' | 'travelIssuedDate' | 'travelExpiryDate' | 'issuedWeeks' | 'carriers' | 'byDirectd' | 'bySegment' | 'keepAmount' | 'keepRebate' | 'passengerTypes' | 'sortingId' | 'isEnabled' | 'remarks' | 'autoToPay' | 'automated' | 'agentIds' | 'branchId'|'cabinCodes'>

export interface IQuoteUploadList {
    id: string,
    groupId:string
    branchIds: string[],
    policyType:'quote'| 'teamed'| 'profit'
    totalCount: number,
    failedRows: number[],
    fileSize: number,
    isDeleted: boolean,
    fileName: string,
    fileType: string,
    creator: string,
    time: string
}
export interface IQuoteUploadSearch{
    isDeleted: boolean|null
    creator: string
    minTime: string
    maxTime: string
    policyType: 'quote' | 'teamed' | 'profit'
}

export interface IQuoteSubZonesForm {
    branchId: string,
    isEnabled: boolean|null,
    minTime: string,
    maxTime: string,
    id: string,
    zoneCode: string,
    iataCode: string,
    operator: string,
    creator: string,
    sourceType:ISourceType|null;
}


export type IQuoteSubZonesItem = Omit<IQuoteSubZonesForm, 'minTime'|'maxTime'|'iataCode'|'branchId'> & {
    branchId:string
    iataCodes:string[]
    remarks:string
    updatedTime:string
    createdTime:string
}
export type IQuoteSubZones = {
    count:number,
    items:IQuoteSubZonesItem[]
}

export type IQuoteSubZonesAddForm = Pick<IQuoteSubZonesItem, 'zoneCode'|'isEnabled'|'remarks'|'iataCodes'|'id'> & {
    branchId:string
}
export type IFuzzyQueryQuoteSubZones = {
    zoneCode: string,
    remarks:string
    iataCodes:string[]
}
export type IGlobalZoonCoods = {
    countries:{
        countryCode:string
        countryEName:string
        countryCName:string
        citys:{
            cityCode:string
            timeZone: number
            cityEName: string
            cityCName: string
            airports: {
                airportEName: string
                airportCName: string
                airportCode: string
            }[]
        }[]
    }[]
    quoteSubZones:{
        zoneCode: string
        remarks: string
        iataCodes: string[]
    }[]
}


export type TeamPoliciesSearchGroup =
    Pick<ISearchQuotePoliciesGroup, 'branchId' | 'agentId' | 'id'  | 'isEnabled' | 'minTime' | 'maxTime' | 'channelCode'>
    & {
    contractNo: string
    flightNumber: string
    arrivalAirport: string
    departureAirport: string
}
export type ITeamHistorys = {
    id: string
    teamPolicyId: string
    orderId: string
    soldQuantity: number
    issuedDates: string[]
    time: string
}

export type ITeamValences = {
    passengerType: PassengerType
    cabinLevel: CabinLevel
    printAmount: number|string
    taxesAmount: number|string
    cancelNotes: string[]
    refundNotes: string[]
    changeNotes: string[]
    othersNotes: string[]
    luggages: {
        luggageType: LuggageType
        luggageCount: number|string
        luggageNotes: string
        luggageSizeType: LuggageSizeType
    }[]
    travelIssuedDate: string
    travelExpiryDate: string
    issuedWeeks: number[]
}

export type ITeamdRoutings = {
    id?: string
    teamdSegmentId?: string
    travelIssuedDate: string
    travelExpiryDate: string
    issuedWeeks: number[]
    agentIds: string[]
    branchIds: string[]
    sortingId: string
    isEnabled:boolean
    cabinLevels:CabinLevel[]
    operator:string
    creator:string
    updatedTime:string
    createdTime:string
    teamdPatterns:{
        keepAmount:number|string
        keepRebate:number|string
        passengerTypes:PassengerType[]
    }[]
}

export type ITeamRoutingForm = Pick<ITeamdRoutings, 'travelIssuedDate'|'travelExpiryDate'|'issuedWeeks'|'agentIds'|'isEnabled'|'cabinLevels'|'teamdPatterns'|'teamdSegmentId'|'id'|'branchIds'>

export type ITeamdInStocks = {
    id:string
    issuedDate: string
    numberOfSeats: number|string
    operator: string
    updatedTime: string
    createdTime: string
}

export type ITeamdInStocksForm = Pick<ITeamdInStocks, 'issuedDate'|'numberOfSeats'> & {
    id?:string
}

type ITeamdHistories = {
    id:string
    orderId:string
    soldQuantity:number
    issuedDate:string
    time:string

}

export type ITeamdInCabins = Pick<ITeamdRoutings, 'id'> & {
    cabinLevel:CabinLevel
    cabinCode:string
    teamdValences: ITeamdValences[],
    teamdInStocks: ITeamdInStocks[]
    teamdHistories: ITeamdHistories[]
    sortingId?:string|number
}

export type ITeamdTransits = Pick<Segment, 'sequenceNo'|'isLuggageChecked'|'flightNumber'|'shareToFlightNo'|'departureAirport'|'arrivalAirport'|'arrivalTime'|'departureTerminal'|'arrivalTerminal'|'flightMealType'|'aircraftModel'|'totalFlyingTime'|'stops'> & {
    id?: string
    timeOfStay: string
    arrivalOffset: string|number
}

export type ITeamdPricing = (Pick<Amount, 'luggages'|'othersNotes'|'changeNotes'|'refundNotes'|'cancelNotes'|'passengerType'|'taxesAmount'> & {
    id?: string
    costdAmount:number|string
    salesAmount:number|string
})
export type ITeamdValences = {
    id?:string
    familyName:string
    teamdPricings:ITeamdPricing[]
}

export type ITeamdSchedules = Pick<Segment, 'shareToFlightNo'|'departureTime'| 'arrivalTime'|'departureTerminal'|'arrivalTerminal'|'flightMealType'|'aircraftModel'|'totalFlyingTime'|'stops'> & {
    id?:string
    isEnabled:boolean
    travelIssuedDate: string
    travelExpiryDate: string
    issuedWeeks:number[]
    arrivalOffset: string|number
    operator?:string
    updatedTime?:string
    createdTime?:string
    teamdTransits:ITeamdTransits[]
}

export type ITeamdSegments = Pick<Segment, 'flightNumber'|'shareToFlightNo'|'departureAirport'|'arrivalAirport'|'departureTime'|'arrivalTime'|'departureTerminal'|'arrivalTerminal'|'flightMealType'|'aircraftModel'|'totalFlyingTime'|'stops'> & {
    id?:string
    teamdPolicyId: string
    isEnabled:boolean
    travelIssuedDate: string
    travelExpiryDate: string
    issuedWeeks:number[]
    arrivalOffset: string|number
    operator?: string
    creator?: string
    updatedTime?: string
    createdTime?: string
    teamdRoutings: ITeamdRoutings[]
    teamdInCabins: ITeamdInCabins[]
    teamdSchedules: ITeamdSchedules[]
}

export type ITeamdFight = Pick<ITeamdSegments, 'flightNumber'|'isEnabled'|'arrivalAirport'|'departureAirport'|'teamdPolicyId'|'id'>

export type ITeamdSegmentsForm = Pick<ITeamdSegments, 'id'|'travelIssuedDate'|'travelExpiryDate'|'isEnabled'|'issuedWeeks'|'shareToFlightNo'|'departureTime'|'arrivalOffset'|'arrivalTime'|'departureTerminal'|'arrivalTerminal'|'flightMealType'|'aircraftModel'|'totalFlyingTime'|'stops'> & {
    teamdTransits:ITeamdTransits[]
}

export type ICabin = Pick<Cabin, 'cabinCode'> & {
    cabinLevel: CabinLevel|string
    sortingId?: number|string
}

export type TeamPoliciesGroup =
    Pick<IQuotePoliciesItem, 'id' | 'branchId' | 'isEnabled' | 'remarks' | 'sourceType' | 'updatedTime' | 'createdTime' | 'agentIds' | 'issuedDate' | 'expiryDate' | 'channelCode'>
    & {
    contractNo: string
    operator: string
    creator: string,
    currency: string
    teamdSegments: ITeamdSegments[]
}

export interface TeamPoliciesGroupCount{
    count:number
    items: TeamPoliciesGroup[]
}

export type TeamPoliciesFormGroup = Omit<TeamPoliciesGroup, 'updatedTime' | 'createdTime' | 'sourceType' | 'operator' | 'creator' | 'id'> & {
    id?: string
    flightNumber?:string[]
}

export type TeamPolicy = Pick<TeamPoliciesGroup, 'isEnabled'|'remarks'|'contractNo'|'issuedDate'|'expiryDate'|'currency'> & {
    id?: string
    branchId?: string
    channelCode?: string
}


export type CachingsSearchForm = {
    channelCode: string;
    minTime: string;
    maxTime: string;

    arrivalCity: string,
    departureDate: string,
    departureCity: string,
    expiredTime: string,
    accountName:string
    groupCode?:string
}

export interface ItineraryInfo {
    cityCode: string;
    airportCodes: string[];
    countryCode: string;
    timeZone: number
}

export interface RequestItinerary {
    itineraryNo: number;
    arrival: string;
    departureDate: string;
    departure: string;
    arrivalInfo: ItineraryInfo;
    departureInfo: ItineraryInfo;
}

export interface RequestData {
    itineraryType: ItineraryType;
    cabinLevel: CabinLevel;
    itineraries: RequestItinerary[];
    travelers: {
        passengerCount: number
        passengerType: PassengerType
    }[]
}

export interface StopInfo {
    stopTime: string|number;
    stopAirport: string;
}

export interface Cabin {
    cabinLevel: CabinLevel;
    quantity: number|null;
    cabinName: string|null;
    cabinInfo: string|null;
    cabinCode: string;
}

export interface Segment {
    isLuggageChecked: boolean|null;
    sequenceNo: number|null;
    carrier: string;
    flightNumber: string;
    shareToFlightNo: string|null;
    departureAirport: string;
    arrivalAirport: string;
    departureTime: string;
    arrivalTime: string;
    departureTerminal: string|null;
    arrivalTerminal: string|null;
    flightMealType: string|null;
    aircraftModel: string|null;
    totalFlyingTime: string|null;
    stops: StopInfo[];
    cabins: Cabin[];
    status?: 'unknown'| 'scheduled'| 'departed'| 'arrived'| 'delayed'| 'cancelled'| 'byother'
}

export interface Luggage {
    luggageType: string;
    luggageCount: number|string;
    luggageNotes: string;
    luggageSizeType: string;
}

export interface Amount {
    familyName: string;
    familyCode: string;
    cabinLevel: CabinLevel;
    nextCodes: string[];
    passengerType: PassengerType;
    minimum: number|string;
    maximum: number|string;
    commissionAmount:string|null
    commissionRebate:string|null
    printAmount: number|string;
    taxesAmount: number|string;
    cancelNotes: string[]|string;
    refundNotes: string[]|string;
    changeNotes: string[]|string;
    othersNotes: string[]|string;
    cabinCodes: string[]|string;
    luggages: Luggage[];
    amountKeys?: string[];
    fareCodes: string[]
}

export interface ResponseItinerary {
    amounts: Amount[];
    itineraryNo?: number|null;
    subItineraryId?: string|null;
    flightNumbers?: string[]
    hasItineraryId?: string|null;
    itineraryKey: string;
    segments: Segment[];
}

export interface QueryResult {
    resultKey: string;
    currency: string;
    isAutoPay: boolean;
    resultType: 'normal'|'teamed'|unknown
    itineraries: ResponseItinerary[];
}

export interface ResponseData {
    queryTimes: number;
    results: QueryResult[];
}

export interface CacheItinerary {
    id: string;
    channelCachingId: string;
    channelCaching: string;
    itineraryNo: number;
    arrivalCity: string;
    departureDate: string;
    departureCity: string;
}

export interface RootObject {
    id: string;
    channelCode: string;
    accountName: string;
    requestKey: string;
    request: RequestData;
    touchTimes: number;
    response: ResponseData & {
        updatedTime: string;
    };
    expiredTime: string;
    updatedTime: string;
    cacheItineraries: CacheItinerary[];
}


export interface OrderInfo {
    id: string
    indexId: string
    isVisible: boolean
    message: string
    creator: string
    time: string|Date
}

export type PaymentOrder = {
    exchangeRate:string
    remarks:string
    totalAmount:string
    changedType: ChangedType
    paymentType: PaymentType
}

export interface AgentUploadList {
    id: string,
    agentId: string,
    fileSize: number,
    remarks: string,
    creator: string,
    time: string,
    fileName: string,
    fileType: string
}


export interface PushSearch {
    operator: string,
    indexId: string,
    minTime: string,
    maxTime: string
}

export type PushInfo = Pick<PushSearch, 'operator'|'indexId'> & {
    id: string,
    branchId: string,
    agentId: string,
    notifyType: 'message'| 'delayed'| 'cancelled',
    isVisible: true,
    message: string,
    remarks: string,
    creator: string,
    updatedTime: string,
    createdTime: string
}

export interface SearchHistory{
    id: string,
    branchId: string,
    agentId: string,
    queryTimes: number,
    orderTimes: number,
    addtoTimes: number,
    currentDay: string
    cacheOnly: boolean|null
}
export interface SearchHistoryForm{
    branchId: string
    agentId: string
    minTime: string
    maxTime: string
}

export interface ValidList{
    id: string
    branchId: string
    agentId: string
    succeed: boolean
    channelCode:string
    request:{
        itineraryType: ItineraryType;
        cabinLevel: CabinLevel;
        travelers: {
            passengerCount: number
            passengerType: PassengerType
        }[]
        segments:{
            itineraryNo:number
            flightNumbers:string[]
        }[]
        itineraries:{
            itineraryNo:number
            arrival:string
            departureDate:string
            departure:string
        }[]
    }
    errorCode:string
    errorMessage:string
    time:string
}

export type ValidSearchForm = {
    branchId: string,
    agentId: string,
    channelCode: string,
    succeed: boolean|null,
    errorCode: string,
    minTime: string,
    maxTime: string
}


export type ChannelHistories = Omit<SearchHistory, 'agentId'> & {
    channelCode: string,
    accountName: string,
    hasReset: string
}
export type ChannelHistoriesForm = Omit<SearchHistoryForm, 'agentId'> & {
    channelCode: string,
    accountName: string,
}

export interface DashboardTotalForm {
    branchIds?:string[]
    agentIds?:string[]
    minTime?:string
    maxTime?:string
    channelCodes?:string[]
    isTravelDateTime?:boolean
    localTime?:string
    carrier?:string
}
export interface ICounts {
    totalSegments:number
    totalOrders:number
    totalAmount:number
    totalProfit:number
}
export interface DashboardTotal{
    counts:ICounts
    branches?:{
        branchId:string
        counts:ICounts
    }[]
    agents?:{
        agentId:string
        counts:ICounts
    }[]
    flights:{
        flightCode:string
        counts:ICounts
    }[]
    dates?:{
        date:string
        counts:ICounts
    }[]
    channels:{
        channelCode:string
        counts:ICounts
    }[]
    hours?:{
        hour:string
        counts:ICounts
    }[]
}

export type DashboardTimers = {
    realdTimes:string|number
    cacheTimes:string|number
    queryTimes:string|number
    orderTimes:string|number
}
export interface DashboardScaleForm{
    agentIds:string[]
    branchIds:string[]
    minDate:string
    maxDate:string
}
export interface DashboardScale{
    times:DashboardTimers
    branches:{
        branchId:string
        branchCode:string
        times:DashboardTimers
    }[]
    agents:{
        agentId:string
        agentCode:string
        times:DashboardTimers
    }[]
    sDates:{
        date:string
        times:DashboardTimers
    }[]
    cDates:{
        queryTimes:number
        orderTimes:number
        date:string
    }[]
    channels:{
        channelCode:string
        channelName:string
        queryTimes:number
        orderTimes:number
    }[]
}

export type IProfitPoliciesSearchForm = Pick<ISearchQuotePoliciesGroup, 'branchId'|'id'|'channelCode'|'carrier'|'arrival'|'departure'|'isEnabled'|'isExpired'|'operator'|'creator'|'minTime'|'maxTime'|'batchCode'|'itineraryType'> & {
    sourceType:null|ISourceType
}

export type IProfitPoliciesItem = Pick<IQuotePoliciesItem, 'id'|'branchId'|'isEnabled'|'channelCode'|'issuedDate'|'expiryDate'|'bySegment'|'keepAmount'|'keepRebate'|'cabinLevels'|'departures'|'arrivals'|'passengerTypes'|'remarks'|'updatedTime'|'createdTime'|'travelIssuedDate'|'travelExpiryDate'|'issuedWeeks'|'carriers'> & {
    operator:string
    creator:string
    groupId:string
    sortingId?: number|string
    batchCode: string
    branchIds:string[]
    flightTypes:('oneWay'|'round'| 'multi')[]
    byDirectd:boolean|''
    sourceType:ISourceType
    cabinCodes:string[]
}
export type IProfitPolicies = {
    count:number
    items: IProfitPoliciesItem[]
}
export type IProfitPoliciesItemForm =
    Pick<IQuotePoliciesItem, 'isEnabled' | 'channelCode' | 'issuedDate' | 'expiryDate' | 'bySegment' | 'keepAmount' | 'keepRebate' | 'cabinLevels' | 'departures' | 'arrivals' | 'passengerTypes' | 'remarks' | 'travelIssuedDate' | 'travelExpiryDate' | 'issuedWeeks' | 'carriers'|'cabinCodes'>
    & {
    id?:string
    branchId: string
    branchIds: string[]
    flightTypes:'oneWay'|'round'| 'multi'[]
    byDirectd:boolean|''
    sortingId?: number|string
}


export type ICountries = {
    id?: string
    countryCode: string,
    nationality: string
    countryName: string
    operator?: string
    updatedTime?: string
}

export type ChannelCode = {
    agentIds:string[]
    isAdding:boolean
    channelCode:string
    groupId?:string
}
