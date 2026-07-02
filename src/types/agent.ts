import type {AssemblyData} from "@/types/identity.ts";
import type {
    AgentPayment,
    CommonResponseGroup,
    GroupBalance,
    IExchangeRate,
    ISearchRechargeForm
} from "@/types/group.ts";

// Re-export with the same name
export type GroupAssemblyData = AssemblyData;
export type CommonResponseAgent = CommonResponseGroup

export type ExpandsSetting = {
    indexId: string;
    value: string;
    name: string;
}

export interface FeessSetting {
    id: string;
    agentSettingId: string;
    isEnabled: boolean;
    voidedFeesAmount: number|string;
    appendFeesAmount: number|string;
    refundFeesAmount: number|string;
    changeFeesAmount: number|string;
    orderRangeAmount: number|string;
    payedRangeAmount: number|string;
    issuedDate: string;
    operator: string;
    updatedTime: string;
    createdTime: string;
}

export type TopupSettings = Pick<FeessSetting, 'id'|'agentSettingId'|'isEnabled'|'issuedDate'|'operator'|'updatedTime'|'createdTime'> & {
    minPaymentAmount: number|string;
    maxPaymentAmount: number|string;
    minServiceFees: number|string;
    maxServiceFees: number|string;
    serviceFeeRate: number|string;
    paymentCodes: string[]
    currencyCodes: string[]
}


export type IproviderType = 'notifyEvents'| 'issuedTicket'| 'rejectTicket'| 'refundTicket'| 'rejectRefund'| 'changeTicket'| 'rejectChange'| 'issuedAmount'| 'rejectAmount'
export interface PushProvider {
    id: string;
    agentSettingId: string;
    isEnabled: boolean;
    providerType: IproviderType; // 可改为具体的联合类型，如 'notifyEvents' | 'otherType'
    request_Url: string;
    timeoutSeconds: number|string;
    operator: string;
    updatedTime: string;
    createdTime: string;
    expandSettings: ExpandsSetting[];
}


export interface ScaleSetting {
    id: string;
    agentSettingId: string;
    isEnabled: boolean;
    scaleLimitedDaysLength: number|string;
    scaleLimited: number|string;
    scaleLimitedFineByOnce: number|string;
    issuedDate: string;
    operator: string;
    updatedTime: string;
    createdTime: string;
}

export type AddAgentSettingForm = {
    id: string;
    branchId: string;
    agentId: string;
    isEnabled: boolean;
    contactName: string;
    phoneNumber: string;
    emailAddress: string;
    localAddress: string;
    remarks: string;
    channelCodes: string[];
}
export type DataAccessersAgent = {
    id: string;
    agentSettingId: string;
    isEnabled: boolean;
    remoteAddress: string;
    operator: string;
    updatedTime: string|Date;
    createdTime: string|Date;
    expandSettings: ExpandsSetting[]
}

export interface AgentSetting extends AddAgentSettingForm {
    operator: string;
    updatedTime: string|Date;
    createdTime: string|Date;
    feessSettings: FeessSetting[];
    pushProviders: PushProvider[];
    scaleSettings: ScaleSetting[];
    expandSettings: ExpandsSetting[];
    dataAccessers: DataAccessersAgent[]
    topupSettings: TopupSettings[]
}
export type ChangedType = 'income'|'outlay'|unknown; // 如有更多类型可在此扩展
export type PaymentType = 'orderPaying'| 'rejectTicket'| 'orderVoided'| 'orderRefund'| 'rejectRefund'| 'orderChange'| 'rejectChange'| 'compensatory'| 'assistIncome'| 'assistOutlay'| 'reCommission'| 'otherReasons'|unknown; // 如有固定枚举建议列出

export interface ISearchPayMentForm {
    orderNumber:string;
    transactionId:string;
    id:string;
    minTime:Date|string;
    maxTime:Date|string;
    changedType: ChangedType;
    paymentType: PaymentType;
}


export interface TradeHistory {
    accountCurrency:string
    beforeBalance: number;
    currentBalance: number;
    agentAccountId: string;
    tradePaymentId: string;
    time: string; // ISO 时间字符串，例如 "2025-06-05T04:15:36.988Z"
}


export interface TradeRecord {
    id: string;
    branchId: string;
    agentId: string;
    orderNumber: string;
    transactionId: string;
    beforeBalance: number;
    currentBalance: number;
    currency: string;
    totalAmount: number;
    exchangeRate: number;
    changedType: ChangedType;
    paymentType: PaymentType;
    remarks: string;
    operator: string;
    creator: string;
    tradeHistory: TradeHistory;
    updatedTime: string;
    createdTime: string;
    reconciled?:boolean
    balance?:string
    bookingHistory?: {
        bookingPayment: string
        bookingPaymentId: string
        paymentAccount: string
        paymentAccountId: string
    }
}

// Re-export with the same name
export type AgentBalance = GroupBalance

// Re-export with the same name
export type ISearchRechargeFormAgent = ISearchRechargeForm
export type AgentPaymentAgent = AgentPayment
export type IExchangeRateAgent = IExchangeRate


export type AddAgentPaymentForm = Omit<AgentPayment, 'branchId'|'agentId'|'status'|'exchangeRate'|'operator'|'creator'|'updatedTime'|'createdTime'|'agentHistory'|'agentReceipts'>
export interface CancelAgentPaymentAgent {
    id: string;
    remarks: string;
}




