import axios from "../createRequest.ts";
import {
    type AgentPayment,
    type AgentSettingGroup,
    type BookingPayment,
    type CommonResponseGroup,
    type GroupAssemblyData,
    type GroupBalance,
    type IAddGlobalAirportsForm,
    type IAddWayPoints,
    type IBooking,
    type IExchangeRate,
    type IGetGlobalAirports,
    type IGetGlobalAirportsForm,
    type IPayment,
    type ISearchBooking,
    type ISearchBookingPayment,
    type ISearchPayMentFormGroup,
    type ISearchRechargeForm,
    type ISearchRechargePaymentForm,
    type IWayPoints,
    type IWayPointsForm,
    type RechargePayment,
    type TradeRecordGroup,
    type AddAgentSettingFormGroup,
    type ExpandsSettingFormGroup,
    type FeessSettingFormGroup,
    type ScaleSettingFormGroup,
    type PushProviderFormGroup,
    type IChannelSettings,
    type AgentAccountForm,
    type IChannelAccount,
    type IPaymentForm,
    type RechargePaymentForm,
    type RevokeAgentPaymentFormGroup,
    type IPageInfo,
    type ISearchQuotePoliciesGroup,
    type IQuotePoliciesGroup,
    type IQuotePoliciesFormGroup,
    type TeamPoliciesSearchGroup,
    type IPolicyPaymentForm,
    type DataAccessersFormGroup,
    type CachingsSearchForm,
    type RootObject,
    type OrderInfo,
    type PaymentOrder,
    type IQuoteUploadSearch,
    type IQuoteUploadList,
    type IQuoteSubZones,
    type IQuoteSubZonesForm,
    type IQuoteSubZonesAddForm,
    type IFuzzyQueryQuoteSubZones,
    type PushSearch,
    type PushInfo,
    type IQuotePoliciesItem,
    type SearchHistory,
    type SearchHistoryForm,
    type ChannelHistories,
    type ChannelHistoriesForm,
    type IExchangeRateForm,
    type IGlobalZoonCoods,
    type DashboardTotalForm,
    type DashboardTotal,
    type VoidCommonResponseGroup,
    type IProfitPoliciesSearchForm,
    type IProfitPolicies,
    type IProfitPoliciesItemForm,
    type IProfitPoliciesItem, type TeamPoliciesGroupCount, type ReturnSoldQuantityForm, type IChannelBalanceForm,
    type IChannelSettingsBalance, type IFindBalanceAccountsForm, type IPaymentAccount, type IBalanceAccountForm,
    type ValidSearchForm, type ValidList, type TeamPolicy, type ITeamdSegmentsForm, type ICabin, type ITeamdValences,
    type ITeamdInStocksForm, type ITeamRoutingForm, type TeamPoliciesGroup, type ITeamdFight,
    type ConfirmationChannelForm, type ICountries, type DashboardScaleForm, type DashboardScale, type ChannelCode,
    type TopupSettingsFormGroup, type IChannelPayedSettings, type IPayedSettingUpdate, type IPayedInvokerUpdate,
    type IChannelPayedSettingsSearch, type ITopupPaymentsList
} from "@/types/group.ts";
import type {
    AppendConsult, AppendConsultForm, AppendReplenishLogForm,
    BookingAddForm, BookingAuxiliaryForm, BookingChangeForm,
    BookingOrder, BookingQuoteSearch, BookingRefundForm, BookingStatus, BookingVoidedForm, ChangeStatus,
    CommonResponseOrder, FQueryResult, IAuxiliaryStatus, IAuxiliaryStatusBooking, IBookingAuxiliary,
    IBookingChange,
    IBookingRefund,
    IBookingVoided,
    IChange, IChangeStatus, IOrderAuxiliary, IOrderAuxiliaryCount, IOrderAuxiliarySearchForm,
    IOrderChange, IOrderChangeCount,
    IOrderChangeSearchForm,
    IOrderManual, IOrderManualCount,
    IOrderManualSearchForm,
    IOrderRefund, IOrderRefundCount,
    IOrderRefundSearchForm, IPushNotify,
    IRefund, IRefundStatus, ISeekType,
    ITicketStatus, OrderNum, PurchaseRefund,
    PurchaseRefundResponseGroup, QueryGlobalAirports, QueryResultCreate, RefundStatus, TicketNumberForm,
    UpOrderAmounts, UpOrderAppendAmounts,
    UpOrderRCAmounts, VoidingStatus,
} from "@/types/order.ts";
import type {CommonResponseAgent, FeessSetting, TradeRecord} from "@/types/agent.ts";
import type {CommonResponseUpload, DocForm, DocListItem, DocSearch, Document} from "@/types/common.ts";

export const getFeessSettingGroup  = (id:string) => axios.get<FeessSetting>(`/groupApi/Configs/GetFeessSetting/${id}`)

export const getAuthorizableRoutingGroup = ()  => axios.get<GroupAssemblyData>('/groupApi/Identity/GetAuthorizableRouting')

// 获取代理基础配置信息
export const getAgentSettingGroup = (id:string) => axios.get<AgentSettingGroup>(`/groupApi/Configs/GetAgentSetting/${id}`)

// 添加代理接口授权
export const addDataAccesserGroup = (form:DataAccessersFormGroup) => axios.post<CommonResponseGroup,DataAccessersFormGroup>('/groupApi/Configs/AddDataAccesser',form)

export const addTopupSettingGroup = (form:TopupSettingsFormGroup) => axios.post<CommonResponseGroup,TopupSettingsFormGroup>(`/groupApi/Configs/AddTopupSetting`,form)
export const updateTopupSettingGroup = (form:TopupSettingsFormGroup) => axios.patch<CommonResponseGroup,TopupSettingsFormGroup>(`/groupApi/Configs/UpdateTopupSetting`,form)
export const deleteTopupSettingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteTopupSetting/${id}`)

export const getTopupPaymentsGroup = ({page,pageSize}:{page:number,pageSize:number},form: IChannelPayedSettingsSearch) => axios.post<ITopupPaymentsList[],IChannelPayedSettingsSearch>(`/groupApi/Configs/GetTopupPayments/${page}/${pageSize}`,form)
export const exportTopupPaymentsGroup = (form: IChannelPayedSettingsSearch) => axios.post<Blob,IChannelPayedSettingsSearch>(`/groupApi/Configs/ExportTopupPayments`,form,{responseType: 'blob'})



// 更新代理接口授权
export const updateDataAccesserGroup = (form:DataAccessersFormGroup) => axios.patch<CommonResponseGroup,DataAccessersFormGroup>('/groupApi/Configs/UpdateDataAccesser',form)

// 删除代理接口授权
export const deleteDataAccesserGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteDataAccesser/${id}`)

// 添加代理手续费配置
export const addFeessSettingGroup = (form:FeessSettingFormGroup) => axios.post<CommonResponseGroup,FeessSettingFormGroup>(`/groupApi/Configs/AddFeessSetting`,form)

// 更新代理手续费配置
export const updateFeessSettingGroup = (form:FeessSettingFormGroup) => axios.patch<CommonResponseGroup,FeessSettingFormGroup>(`/groupApi/Configs/updateFeessSetting`,form)

// 删除代理手续费配置
export const deleteFeessSettingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteFeessSetting/${id}`)

// 添加代理查定比设置
export const addScaleSettingGroup = (form:ScaleSettingFormGroup) => axios.post<CommonResponseGroup,ScaleSettingFormGroup>(`/groupApi/Configs/AddScaleSetting`,form)

// 更新代理查定比设置
export const updateScaleSettingGroup = (form:ScaleSettingFormGroup) => axios.patch<CommonResponseGroup,ScaleSettingFormGroup>(`/groupApi/Configs/UpdateScaleSetting`,form)

// 删除代理查定比设置
export const deleteScaleSettingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteScaleSetting/${id}`)

// 添加代理接口配置
export const addDataProviderGroup = (form:PushProviderFormGroup) => axios.post<CommonResponseGroup,PushProviderFormGroup>('/groupApi/Configs/AddPushProvider',form)

// 更新代理接口配置
export const updateDataProviderGroup = (form:PushProviderFormGroup) => axios.patch<CommonResponseGroup,PushProviderFormGroup>('/groupApi/Configs/UpdatePushProvider',form)

// 删除代理接口配置
export const deleteDataProviderGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeletePushProvider/${id}`)

// 添加代理设置AddAgentS
export const addAgentSettingGroup = (form:AddAgentSettingFormGroup) => axios.post<CommonResponseGroup,AddAgentSettingFormGroup>('/groupApi/Configs/AddAgentSetting',form)

// 更新代理设置
export const updateAgentSettingGroup = (form:AddAgentSettingFormGroup) => axios.patch<CommonResponseGroup,AddAgentSettingFormGroup>('/groupApi/Configs/UpdateAgentSetting',form)

// 删除代理设置
export const deleteAgentSettingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteAgentSetting/${id}`)

// 更新代理接口扩展
export const updateProviderExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdateProviderExpands',form)

// 更新代理设置扩展
export const updateSettingExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdateSettingExpands',form)


// 获取代理余额账户信息
export const getAgentAccountGroup = (id:string) => axios.get<GroupBalance>(`/groupApi/Configs/GetAgentAccount/${id}`)

// 添加代理余额账户
export const addAgentAccountGroup = (form:AgentAccountForm) => axios.post<CommonResponseGroup,AgentAccountForm>(`/groupApi/Configs/AddAgentAccount`,form)

// 更新代理余额账户
export const updateAgentAccountGroup = (form:AgentAccountForm) => axios.patch<CommonResponseGroup,AgentAccountForm>(`/groupApi/Configs/UpdateAgentAccount`,form)

// 更新代理账户扩展
export const updateAgentExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdateAgentExpands',form)

// 查看代理充值记录凭证
export const downloadAgentReceiptGroup = (id:string) => axios.get<Blob>(`/groupApi/Configs/DownloadAgentReceipt/${id}`,{},{responseType: 'blob'})

// 删除代理充值记录凭证
export const deleteAgentReceiptGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteAgentReceipt/${id}`)

// 上传代理充值记录凭证
export const uploadAgentReceiptsGroup = (form:{
    id: string
    remarks: string
    formFiles: {
        file: File
    }[]
}) => {
    const formData = new FormData()
    formData.append('Id', form.id)
    formData.append('Remarks', form.remarks)
    form.formFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Configs/UploadAgentReceipts`,formData,'post')
}


// 撤销代理余额变动申请
export const rejectAgentPaymentGroup = (form:{id:string,remarks:string}) => axios.patch<CommonResponseGroup,{id:string,remarks:string}>(`/groupApi/Configs/RejectAgentPayment`,form)

export const reviewedAgentPaymentGroup = ({id,remarks}:{id:string,remarks:string}) => axios.patch<CommonResponseGroup,{id:string,remarks:string}>(`/groupApi/Configs/ReviewedAgentPayment`,{id,remarks})


// 确认代理余额变动申请
export const confirmAgentPaymentGroup = (form:RevokeAgentPaymentFormGroup) => axios.patch<CommonResponseGroup,RevokeAgentPaymentFormGroup>(`/groupApi/Configs/ConfirmAgentPayment`,form)






// 获取代理订单支付记录信息
export const getTradePaymentsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchPayMentFormGroup) => axios.post<TradeRecordGroup[],ISearchPayMentFormGroup>(`/groupApi/Configs/GetTradePayments/${page}/${pageSize}`,form)
export const exportTradePaymentsGroup = (form:ISearchPayMentFormGroup) => axios.post<Blob,ISearchPayMentFormGroup>(`/groupApi/Configs/ExportTradePayments`,form,{responseType: 'blob'})

// 获取代理充值支付记录信息
export const getAgentPaymentsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchRechargeForm) => axios.post<AgentPayment[],ISearchRechargeForm>(`/groupApi/Configs/GetAgentPayments/${page}/${pageSize}`,form)
export const exportAgentPaymentsGroup = (form:ISearchRechargeForm) => axios.post<Blob,ISearchRechargeForm>(`/groupApi/Configs/ExportAgentPayments`,form,{responseType: 'blob'})


// 获取预定账户配置信息
export const getChannelAccountsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchBooking) => axios.post<IBooking[],ISearchBooking>(`/groupApi/Configs/GetChannelAccounts/${page}/${pageSize}`,form)

// 获取支付账户配置信息
export const getPaymentAccountsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchBooking) => axios.post<IPayment[],ISearchBooking>(`/groupApi/Configs/GetPaymentAccounts/${page}/${pageSize}`,form)

// 添加支付账户
export const addPaymentAccountGroup = (form:IPaymentForm) => axios.post<CommonResponseGroup,IPaymentForm>('/groupApi/Configs/AddPaymentAccount',form)

// 更新支付账户
export const updatePaymentAccountGroup = (form:IPaymentForm) => axios.patch<CommonResponseGroup,IPaymentForm>('/groupApi/Configs/UpdatePaymentAccount',form)

// 更新支付账户扩展
export const updatePaymentExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdatePaymentExpands',form)

// 删除支付账户
export const deletePaymentAccountGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeletePaymentAccount/${id}`)




// 获取预定支付记录信息
export const getBookingPaymentsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchBookingPayment) => axios.post<BookingPayment[],ISearchBookingPayment>(`/groupApi/Configs/GetBookingPayments/${page}/${pageSize}`,form)




// 获取充值支付记录信息
export const getAccountPaymentsGroup = ({page,pageSize}:{page:number,pageSize:number},form:ISearchRechargePaymentForm) => axios.post<RechargePayment[],ISearchRechargePaymentForm>(`/groupApi/Configs/GetAccountPayments/${page}/${pageSize}`,form)
export const exportAccountPaymentsGroup = (form:ISearchRechargePaymentForm) => axios.post<Blob,ISearchRechargePaymentForm>(`/groupApi/Configs/ExportAccountPayments`,form,{responseType: 'blob'})

// 添加充值记录
export const addAccountPaymentGroup = (form:RechargePaymentForm) => axios.post<CommonResponseGroup,RechargePaymentForm>('/groupApi/Configs/AddAccountPayment',form)

// 更新充值信息
export const updateAccountPaymentGroup = (form:RechargePaymentForm) => axios.patch<CommonResponseGroup,RechargePaymentForm>('/groupApi/Configs/UpdateAccountPayment',form)

// 取消渠道充值记录
export const cancelAccountPaymentGroup = (form:{id:string,remarks:string}) => axios.patch<CommonResponseGroup,{id:string,remarks:string}>('/groupApi/Configs/CancelAccountPayment',form)
export const reviewedAccountPaymentGroup = (form:{id:string,remarks:string}) => axios.patch<CommonResponseGroup,{id:string,remarks:string}>('/groupApi/Configs/ReviewedAccountPayment',form)
export const rejectAccountPaymentGroup = (form:{id:string,remarks:string}) => axios.patch<CommonResponseGroup,{id:string,remarks:string}>('/groupApi/Configs/RejectAccountPayment',form)
export const confirmAccountPaymentGroup = (form:ConfirmationChannelForm) => axios.patch<CommonResponseGroup,ConfirmationChannelForm>('/groupApi/Configs/ConfirmAccountPayment',form)


// 删除充值记录



// 查看充值记录凭据
export const downloadAccountReceiptGroup = (id:string) => axios.get<Blob>(`/groupApi/Configs/DownloadAccountReceipt/${id}`,{},{responseType: 'blob'})

// 删除充值记录凭据
export const deleteAccountReceiptFileGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteAccountReceipt/${id}`)

// 上传充值记录凭据
export const uploadAccountReceiptsGroup = (form:{
    id: string
    remarks: string
    formFiles: {
        file: File
    }[]
}) => {
    const formData = new FormData()
    formData.append('Id', form.id)
    formData.append('Remarks', form.remarks)
    form.formFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Configs/UploadAccountReceipts`,formData,'post')
}




// 获取货币名称列表
export const getCurrencyNamesGroup = () => axios.get('/groupApi/Configs/GetCurrencyNames')

// 获取当前汇率列表
export const getExchangeRatesGroup = async () => {
    const response:IExchangeRate[] = await axios.get<IExchangeRate[]>('/groupApi/Configs/GetExchangeRates')
    const priority = { USD: 0, CNY: 1 } as const  // 优先级数字越小越靠前
    return response.sort((a, b) => (priority[a.currencyCode as 'USD'|'CNY'] ?? 2) - (priority[b.currencyCode as 'USD'|'CNY'] ?? 2))
}

// 获取制定币种最新汇率
export const getExchangeRateGroup = (currencyCode:string) => axios.get<IExchangeRate>(`/groupApi/Configs/GetExchangeRate/${currencyCode}`)

// 获取全球机场记录信息
export const getGlobalAirportsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IGetGlobalAirportsForm) => axios.post<IGetGlobalAirports[],IGetGlobalAirportsForm>(`/groupApi/Configs/GetGlobalAirports/${page}/${pageSize}`,form)

// 添加全球机场
export const addGlobalAirportGroup = (form:IAddGlobalAirportsForm) => axios.post<CommonResponseGroup,IAddGlobalAirportsForm>(`/groupApi/Configs/AddGlobalAirport`,form)

// 编辑全球机场
export const updateGlobalAirportGroup = (form:IAddGlobalAirportsForm) => axios.patch<CommonResponseGroup,IAddGlobalAirportsForm>(`/groupApi/Configs/UpdateGlobalAirport`,form)

// 删除全球机场
export const deleteGlobalAirportGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteGlobalAirport/${id}`)

// 添加国家
export const getGlobalCountriesGroup = ({page,pageSize}:{page:number,pageSize:number},form:{countryCode:string}) => axios.post<ICountries[],{countryCode:string}>(`/groupApi/Configs/GetGlobalCountries/${page}/${pageSize}`,form)
export const addGlobalCountryGroup = (form:ICountries) => axios.post<CommonResponseGroup,ICountries>(`/groupApi/Configs/AddGlobalCountry`,form)
export const updateGlobalCountryGroup = (form:ICountries) => axios.patch<CommonResponseGroup,ICountries>(`/groupApi/Configs/UpdateGlobalCountry`,form)
export const deleteGlobalCountryGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteGlobalCountry/${id}`)


// 获取航班航点记录信息
export const getQueryWaypointsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IWayPointsForm) => axios.post<IWayPoints[],IWayPointsForm>(`/groupApi/Configs/GetQueryWaypoints/${page}/${pageSize}`,form)

// 获取操作日志信息
export const getOperationLogsGroup = ({page,pageSize}:{page:number,pageSize:number},indexId:string) => axios.get<OrderInfo[]>(`/groupApi/Configs/GetOperationLogs/${indexId}/${page}/${pageSize}`)

// 强制清除缓存
export const cleanupCachesGroup = () => axios.del('/groupApi/Configs/CleanupCaches')

// 添加汇率配置
export const upsertExchangeRateGroup = (form:IExchangeRateForm) => axios.put<CommonResponseGroup,IExchangeRateForm>('/groupApi/Configs/UpsertExchangeRate',form)

// 删除汇率配置
export const deleteExchangeRateGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteExchangeRate/${id}`)






// 添加查询航点
export const addQueryWaypointGroup = (form:IAddWayPoints) => axios.post<CommonResponseGroup,IAddWayPoints>('/groupApi/Configs/AddQueryWaypoint',form)

// 更新查询航点
export const updateQueryWaypointGroup = (form:IAddWayPoints) => axios.patch<CommonResponseGroup,IAddWayPoints>('/groupApi/Configs/UpdateQueryWaypoint',form)

// 删除查询航点
export const deleteQueryWaypointGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteQueryWaypoint/${id}`)


// 获取渠道基础配置信息
export const getChannelSettingsGroup = () => axios.get<IChannelSettings[]>('/groupApi/Configs/GetChannelSettings')
export const getPayedSettingsGroup = () => axios.get<IChannelPayedSettings[]>('/groupApi/Configs/GetPayedSettings')
export const updatePayedSettingGroup = (form: IPayedSettingUpdate) => axios.patch<CommonResponseGroup,IPayedSettingUpdate>('/groupApi/Configs/UpdatePayedSetting',form)
export const updatePayedInvokerGroup = (form: IPayedInvokerUpdate) => axios.patch<CommonResponseGroup,IPayedInvokerUpdate>('/groupApi/Configs/UpdatePayedInvoker',form)
export const updatePayedSettingExpandsGroup = (form: ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdatePayedSettingExpands',form)
export const updatePayedInvokerExpandsGroup = (form: ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>('/groupApi/Configs/UpdatePayedInvokerExpands',form)


export const getChannelBalancesGroup = () => axios.get<IChannelSettingsBalance[]>(`/groupApi/Configs/GetChannelBalances`)
export const updateChannelSettingGroup = (form:{id:string,isEnabled:boolean}) => axios.patch<CommonResponseGroup,{id:string,isEnabled:boolean}>(`/groupApi/Configs/UpdateChannelSetting`,form)
export const updateInvokeProviderGroup = (form:{id:string,isEnabled:boolean,timeoutSeconds:string}) => axios.patch<CommonResponseGroup,{id:string,isEnabled:boolean,timeoutSeconds:string}>(`/groupApi/Configs/UpdateInvokeProvider`,form)
export const updateChannelExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>(`/groupApi/Configs/UpdateChannelExpands`,form)
export const updateInvokerExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>(`/groupApi/Configs/UpdateInvokerExpands`,form)

export const addChannelBalanceGroup = (form:IChannelBalanceForm) => axios.post<CommonResponseGroup,IChannelBalanceForm>(`/groupApi/Configs/AddChannelBalance`,form)
export const updateChannelBalanceGroup = (form:IChannelBalanceForm) => axios.patch<CommonResponseGroup,IChannelBalanceForm>(`/groupApi/Configs/UpdateChannelBalance`,form)
export const deleteChannelBalanceGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Configs/DeleteChannelBalance/${id}`)
export const upsertBalanceSettingsGroup = (form:IBalanceAccountForm) => axios.put<CommonResponseGroup,IBalanceAccountForm>(`/groupApi/Configs/UpsertBalanceSettings`,form)

export const findBalanceAccountsGroup = (form:IFindBalanceAccountsForm) => axios.post<IPaymentAccount[],IFindBalanceAccountsForm>(`/groupApi/Configs/FindBalanceAccounts`,form)


// 获取使用支付账户信息
export const showPaymentAccountsGroup = (branchId:string,channelCode:string) => axios.get(`/groupApi/Configs/ShowPaymentAccounts/${branchId}/${channelCode}`)

// 查找使用支付账户信息
export const findPaymentAccountsGroup = (id:string) => axios.get<IPayment[]>(`/groupApi/Orders/FindPaymentAccounts/${id}`)
export const findPaymentAccountsNoPAgeGroup = (id:string) => axios.post<IPayment[]>(`/groupApi/Configs/FindPaymentAccounts/${id}`)
export const linkPaymentSettingGroup = (form:{channelAccountId:string,paymentAccountId:string}) => axios.post<CommonResponseGroup,{channelAccountId:string,paymentAccountId:string}>(`/groupApi/Configs/LinkPaymentSetting`,form)
export const unLinkPaymentSettingGroup = (form:{channelAccountId:string,paymentAccountId:string}) => axios.del<CommonResponseGroup,{channelAccountId:string,paymentAccountId:string}>(`/groupApi/Configs/UnLinkPaymentSetting`,form)


// 添加渠道账户
export const addChannelSettingsGroup = (form:IChannelAccount) => axios.post<CommonResponseGroup,IChannelAccount>('/groupApi/Configs/AddChannelAccount',form)

// 更新渠道账号
export const updateChannelSettingsGroup = (form:IChannelAccount) => axios.patch<CommonResponseGroup,IChannelAccount>('/groupApi/Configs/UpdateChannelAccount',form)

// 删除渠道账号
export const deleteChannelSettingsGroup = (id:string) => axios.del<CommonResponseGroup>(`groupApi/Configs/DeleteChannelAccount/${id}`)

// 更新渠道账户扩展
export const updateAccountExpandsGroup = (form:ExpandsSettingFormGroup) => axios.patch<CommonResponseGroup,ExpandsSettingFormGroup>(`/groupApi/Configs/UpdateAccountExpands`,form)



// 获取散客政策列表
export const getQuotePoliciesGroup = ({page,pageSize}:IPageInfo,form:ISearchQuotePoliciesGroup) => axios.post<IQuotePoliciesGroup,ISearchQuotePoliciesGroup>(`/groupApi/Policies/GetQuotePolicies/${page-1}/${pageSize}`,form)
export const getQuotePolicyGroup = (id:string) => axios.get<IQuotePoliciesItem>(`/groupApi/Policies/GetQuotePolicy/${id}`)
export const exportQuotePoliciesGroup = (form:ISearchQuotePoliciesGroup) => axios.post<Blob,ISearchQuotePoliciesGroup>(`/groupApi/Policies/ExportQuotePolicies`,form,{responseType: 'blob'})


// 获取利润
export const getProfitPoliciesGroup = ({page,pageSize}:IPageInfo,form:IProfitPoliciesSearchForm) => axios.post<IProfitPolicies,IProfitPoliciesSearchForm>(`/groupApi/Policies/GetProfitPolicies/${page-1}/${pageSize}`,form)
export const exportProfitPoliciesGroup = (form:IProfitPoliciesSearchForm) => axios.post<Blob,IProfitPoliciesSearchForm>(`/groupApi/Policies/ExportProfitPolicies`,form,{responseType: 'blob'})
export const getProfitPolicyGroup = (id:string) => axios.get<IProfitPoliciesItem>(`/groupApi/Policies/GetProfitPolicy/${id}`)
export const addProfitPolicyGroup = (form:IProfitPoliciesItemForm) => axios.post<CommonResponseGroup,IProfitPoliciesItemForm>(`/groupApi/Policies/AddProfitPolicy`,form)
export const updateProfitPolicyGroup = (form:IProfitPoliciesItemForm) => axios.patch<CommonResponseGroup,IProfitPoliciesItemForm>(`/groupApi/Policies/UpdateProfitPolicy`,form)
export const deleteProfitPolicyGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteProfitPolicy/${id}`)

export const importProfitPoliciesGroup = (form:{
    file: File
}) => {
    const formData = new FormData()
    formData.append('excelFile',form.file)
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Policies/ImportProfitPolicies`,formData,'post')
}
export const deleteProfitPoliciesGroup = (form:{
    file: File
}) => {
    const formData = new FormData()
    formData.append('excelFile',form.file)
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Policies/DeleteProfitPolicies`,formData,'post')
}
export const downloadProfitFileGroup = (id:string) => axios.get<Blob>(`/groupApi/Policies/DownloadProfitFile/${id}`, {},{responseType: 'blob'})


// 添加散客政策
export const addQuotePolicyGroup = (form:IQuotePoliciesFormGroup) => axios.post<CommonResponseGroup,IQuotePoliciesFormGroup>('/groupApi/Policies/AddQuotePolicy',form)

// 更新散客政策
export const updateQuotePolicyGroup = (form:IQuotePoliciesFormGroup) => axios.patch<CommonResponseGroup,IQuotePoliciesFormGroup>(`/groupApi/Policies/UpdateQuotePolicy`,form)

// 导入散客政策
export const importQuotePoliciesGroup = (form:{
    file: File
}) => {
    const formData = new FormData()
    formData.append('excelFile',form.file)
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Policies/ImportQuotePolicies`,formData,'post')
}

// 删除散客政策
export const deleteQuotePoliciesGroup = (form:{
    file: File
}) => {
    const formData = new FormData()
    formData.append('excelFile',form.file)
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Policies/DeleteQuotePolicies`,formData,'post')
}

// 获取政策区域列表
export const getQuoteSubZonesGroup = ({page,pageSize}:IPageInfo,form:IQuoteSubZonesForm) => axios.post<IQuoteSubZones,IQuoteSubZonesForm>(`/groupApi/Policies/GetQuoteSubZones/${page-1}/${pageSize}`,form)
// 添加区域政策
export const addQuoteSubZoneGroup = (form:IQuoteSubZonesAddForm) => axios.post<CommonResponseGroup,IQuoteSubZonesAddForm>(`/groupApi/Policies/AddQuoteSubZone`,form)
export const updateQuoteSubZoneGroup = (form:IQuoteSubZonesAddForm) => axios.patch<CommonResponseGroup,IQuoteSubZonesAddForm>(`/groupApi/Policies/UpdateQuoteSubZone`,form)

export const fuzzyQueryQuoteSubZonesGroup = (branchId:string,zoneCode:string) => axios.get<IFuzzyQueryQuoteSubZones[]>(`/groupApi/Policies/FuzzyQueryQuoteSubZones/${branchId}/${zoneCode}/20`)
export const fuzzyQueryGlobalCodesGroup = (zoneCode:string) => axios.get<IGlobalZoonCoods>(`/groupApi/Policies/FuzzyQueryGlobalCodes/${zoneCode}/20`)


export const deleteQuoteSubZoneGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteQuoteSubZone/${id}`)

// 删除散客政策
export const deleteQuotePolicyGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteQuotePolicy/${id}`)

export const getQuoteHistoriesGroup = ({page,pageSize}:{page:number,pageSize:number},form:IQuoteUploadSearch) => axios.post<IQuoteUploadList[],IQuoteUploadSearch>(`/groupApi/Policies/GetQuoteHistories/${page}/${pageSize}`,form)

export const downloadQuoteFileGroup = (id:string) => axios.get<Blob>(`/groupApi/Policies/DownloadQuoteFile/${id}`,{},{responseType: 'blob'})

// 获取团队政策列表
export const getTeamPoliciesGroup = ({page,pageSize}:IPageInfo,form:TeamPoliciesSearchGroup) => axios.post<TeamPoliciesGroupCount,TeamPoliciesSearchGroup>(`/groupApi/Policies/GetTeamdPolicies/${page-1}/${pageSize}`,form)
export const getTeamdPolicyGroup = (id:string) => axios.get<TeamPoliciesGroup>(`/groupApi/Policies/GetTeamdPolicy/${id}`)

// 添加团队政策列表
export const addTeamdPolicyGroup = (form:TeamPolicy) => axios.post<CommonResponseGroup,TeamPolicy>(`/groupApi/Policies/AddTeamdPolicy`,form)

// 更新团队政策列表
export const updateTeamdPolicyGroup = (form:TeamPolicy) => axios.patch<CommonResponseGroup,TeamPolicy>(`/groupApi/Policies/UpdateTeamdPolicy`,form)

// 删除团退政策
export const deleteTeamdPolicyGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdPolicy/${id}`)



export const addTeamdSegmentGroup = (form:ITeamdFight) => axios.post<CommonResponseGroup,ITeamdFight>(`/groupApi/Policies/AddTeamdSegment`,form)
export const updateTeamdSegmentGroup = (form:ITeamdFight) => axios.patch<CommonResponseGroup,ITeamdFight>(`/groupApi/Policies/UpdateTeamdSegment`,form)
export const deleteTeamdSegmentGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdSegment/${id}`)


export const addTeamdScheduleGroup = (id:string,form:ITeamdSegmentsForm) => axios.post<CommonResponseGroup,ITeamdSegmentsForm>(`/groupApi/Policies/AddTeamdSchedule/${id}`,form)
export const updateTeamdScheduleGroup = (id:string,sId:string,form:ITeamdSegmentsForm) => axios.patch<CommonResponseGroup,ITeamdSegmentsForm>(`/groupApi/Policies/UpdateTeamdSchedule/${id}/${sId}`,form)
export const deleteTeamdScheduleGroup = (id:string,sId:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdSchedule/${id}/${sId}`)


export const addTeamdInCabinsGroup = (id:string,form:ICabin[]) => axios.post<CommonResponseGroup,ICabin[]>(`/groupApi/Policies/AddTeamdInCabins/${id}`,form, { headers: { 'Content-Type': 'application/json' }})
export const updateCabinSortingIdGroup = (id:string,cabinId:string,sort:string) => axios.patch<CommonResponseGroup>(`/groupApi/Policies/UpdateCabinSortingId/${id}/${cabinId}/${sort}`)

export const deleteTeamdInCabinGroup = (id:string,cabinId:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdInCabin/${id}/${cabinId}`)

export const upsertTeamdValencesGroup = (id:string,cabinId:string,form:ITeamdValences[]) => axios.put<CommonResponseGroup,ITeamdValences[]>(`/groupApi/Policies/UpsertTeamdValences/${id}/${cabinId}`,form)

export const initialTeamdInStocksGroup = (id:string,cabinId:string,count:string) => axios.patch<CommonResponseGroup>(`/groupApi/Policies/InitialTeamdInStocks/${id}/${cabinId}/${count}`)


export const upsertTeamdInStocksGroup = (id:string,cabinId:string,form:ITeamdInStocksForm[]) => axios.put<CommonResponseGroup,ITeamdInStocksForm[]>(`/groupApi/Policies/UpsertTeamdInStocks/${id}/${cabinId}`,form)
export const updateTeamdInStockGroup = (id:string,cabinId:string,form:ITeamdInStocksForm) => axios.patch<CommonResponseGroup,ITeamdInStocksForm>(`/groupApi/Policies/UpdateTeamdInStock/${id}/${cabinId}`,form)
export const clearTeamdInStocksGroup = (id:string,cabinId:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/ClearTeamdInStocks/${id}/${cabinId}`)
export const deleteTeamdInStockGroup = (id:string,cabinId:string,date:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdInStock/${id}/${cabinId}/${date}`)

export const addTeamdRoutingGroup = (form:ITeamRoutingForm) => axios.post<CommonResponseGroup,ITeamRoutingForm>(`/groupApi/Policies/AddTeamdRouting`,form)
export const updateTeamdRoutingGroup = (form:ITeamRoutingForm) => axios.patch<CommonResponseGroup,ITeamRoutingForm>(`/groupApi/Policies/UpdateTeamdRouting`,form)
export const deleteTeamdRoutingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteTeamdRouting/${id}`)

// 归还销售数量
export const returnSoldQuantityGroup = (form:ReturnSoldQuantityForm) => axios.patch<CommonResponseGroup,ReturnSoldQuantityForm>(`/groupApi/Policies/ReturnSoldQuantity`,form)




// 报价数据

// 获取渠道缓存数据项纪录
export const getChannelCachingsGroup = ({page,pageSize}:{page:number,pageSize:number},form:CachingsSearchForm) => axios.post<RootObject[],CachingsSearchForm>(`/groupApi/Querys/GetChannelCachings/${page}/${pageSize}`,form)

// 获取代理查定比
export const getSearchsHistoriesGroup = ({page,pageSize}:{page:number,pageSize:number},form:SearchHistoryForm) => axios.post<SearchHistory[],SearchHistoryForm>(`/groupApi/Querys/GetSearchsHistories/${page}/${pageSize}`,form)
export const exportSearchsHistoriesGroup = (form:SearchHistoryForm) => axios.post<Blob,SearchHistoryForm>(`/groupApi/Querys/ExportSearchsHistories`,form,{responseType: 'blob'})
export const getChannelHistoriesGroup = ({page,pageSize}:{page:number,pageSize:number},form:ChannelHistoriesForm) => axios.post<ChannelHistories[],ChannelHistoriesForm>(`/groupApi/Querys/GetChannelHistories/${page}/${pageSize}`,form)
export const exportChannelHistoriesGroup = (form:ChannelHistoriesForm) => axios.post<Blob,ChannelHistoriesForm>(`/groupApi/Querys/ExportChannelHistories`,form,{responseType: 'blob'})
export const clearChannelCachingGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Querys/ClearChannelCaching/${id}`)

export const resetAgentHistoryGroup  = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Querys/ResetAgentHistory/${id}`)
export const resetChannelHistoryGroup  = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Querys/ResetChannelHistory/${id}`)

// 校验代理成功率
export const getBookingHistoriesGroup = ({page,pageSize}:{page:number,pageSize:number},form:ValidSearchForm) => axios.post<ValidList[],ValidSearchForm>(`/groupApi/Querys/GetBookingHistories/${page}/${pageSize}`,form)
export const exportBookingHistoriesGroup = (form:ValidSearchForm) => axios.post<Blob,ValidSearchForm>(`/groupApi/Querys/ExportBookingHistories`,form,{responseType: 'blob'})

// order

// 获取交易支付记录
export const getTradePaymentsOrderGroup = (id:string) => axios.get<TradeRecord[]>(`/groupApi/Orders/GetTradePayments/${id}`)
export const getBookingsPaymentsGroup = (id:string) => axios.get<TradeRecord[]>(`/groupApi/Orders/GetBookingPayments/${id}`)


// 获取订单信息列表
export const getOrderListsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderManualSearchForm) => axios.post<IOrderManual[],IOrderManualSearchForm>(`/groupApi/Orders/GetOrderLists/${page}/${pageSize}`,form)
export const getOrdersListGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderManualSearchForm) => axios.post<IOrderManualCount,IOrderManualSearchForm>(`/groupApi/Orders/GetOrdersList/${page-1}/${pageSize}`,form)
export const exportOrderPassengers = (id:string) => axios.get<Blob>(`/groupApi/Orders/ExportOrderPassengers/${id}`,{},{responseType: 'blob'})
export const exportOrderListsGroup = (form:IOrderManualSearchForm) => axios.post<Blob,IOrderManualSearchForm>(`/groupApi/Orders/ExportOrderLists`,form,{responseType: 'blob'})


// 获取订单详情
export const getOrderInfoGroup = (id:string) => axios.get<IOrderManual>(`/groupApi/Orders/GetOrderInfo/${id}`)
// 获取订单类型数数量
export const getAllTypeQuantityGroup = (id:string) => axios.get<OrderNum>(`/groupApi/Orders/GetAllTypeQuantity/${id}`)


// 获取辅营信息列表
export const getAppendListsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderAuxiliarySearchForm) => axios.post<IOrderAuxiliary[],IOrderAuxiliarySearchForm>(`/groupApi/Orders/GetAppendLists/${page}/${pageSize}`,form)
export const getAppendsListGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderAuxiliarySearchForm) => axios.post<IOrderAuxiliaryCount,IOrderAuxiliarySearchForm>(`/groupApi/Orders/GetAppendsList/${page-1}/${pageSize}`,form)
export const exportAppendListsGroup = (form:IOrderAuxiliarySearchForm) => axios.post<Blob,IOrderAuxiliarySearchForm>(`/groupApi/Orders/ExportAppendLists`,form,{responseType: 'blob'})


// 辅营详情
export const getAppendInfoGroup = (id:string) => axios.get<IOrderAuxiliary>(`/groupApi/Orders/GetAppendInfo/${id}`)
export const getAppendInfosGroup = (id:string) => axios.get<IOrderAuxiliary[]>(`/groupApi/Orders/GetAppendInfos/${id}`)

// 辅营单执行驳回操作
export const appendRejectGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/AppendReject/${id}`,form)
// 辅营单驳回金额
export const rejectAppendAmountsGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/RejectAppendAmounts/${id}`,form)
// 辅营单执行
export const setAppendAttachedGroup = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/SetAppendAttached/${id}`)

// 添加修改辅营
export const upsertAppendAmountsGroup = (form:UpOrderAppendAmounts,confirmed:boolean) => axios.put<CommonResponseGroup,UpOrderAppendAmounts>(`/groupApi/Orders/UpsertAppendAmounts/${confirmed}`,form)
// 追加辅营支付记录
export const appendAppendPaymentGroup = (id:string,form:PaymentOrder) => axios.post<CommonResponseGroup,PaymentOrder>(`/groupApi/Orders/AppendAppendPayment/${id}`,form)
// 辅营上传下载
export const downloadAppendFileGroup = (id:string) => axios.get<Blob>(`/groupApi/Orders/DownloadAppendFile/${id}`,{},{responseType: 'blob'})
export const deleteAppendFileGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteAppendFile/${id}`)
export const uploadAppendFilesGroup = (form:{
    id: string
    remarks: string
    formFiles: {
        file: File
    }[]
},flag:boolean) => {
    const formData = new FormData()
    formData.append('AppendId', form.id)
    formData.append('Remarks', form.remarks)
    form.formFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseGroup>(`/groupApi/Orders/UploadAppendFiles/${flag}`,formData,'post')
}



// 获取退票信息列表
export const getRefundListsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderRefundSearchForm) => axios.post<IOrderRefund[],IOrderRefundSearchForm>(`/groupApi/Orders/GetRefundLists/${page}/${pageSize}`,form)
export const getRefundsListGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderRefundSearchForm) => axios.post<IOrderRefundCount,IOrderRefundSearchForm>(`/groupApi/Orders/GetRefundsList/${page-1}/${pageSize}`,form)
export const exportRefundListsGroup = (form:IOrderRefundSearchForm) => axios.post<Blob,IOrderRefundSearchForm>(`/groupApi/Orders/ExportRefundLists`,form,{responseType: 'blob'})

// 获取退票列表
export const getRefundInfosGroup = (id:string) => axios.get<IRefund[]>(`/groupApi/Orders/GetRefundInfos/${id}`)
// 获取退票信息
export const getRefundInfoGroup = (id:string) => axios.get<IRefund>(`/groupApi/Orders/GetRefundInfo/${id}`)
export const downloadRefundFileGroup = (id:string) => axios.get<Blob>(`/groupApi/Orders/DownloadRefundFile/${id}`,{},{responseType: 'blob'})
export const deleteRefundFileGroup = (id:string) => axios.del<CommonResponseAgent>(`/groupApi/Orders/DeleteRefundFile/${id}`)
export const uploadRefundFilesGroup = (form:{
    id: string
    remarks: string
    formFiles: {
        file: File
    }[]
}) => {
    const formData = new FormData()
    formData.append('RefundId', form.id)
    formData.append('Remarks', form.remarks)
    form.formFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseAgent>(`/groupApi/Orders/UploadRefundFiles`,formData,'post')
}

// 获取改签信息列表
export const getChangeListsGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderChangeSearchForm) => axios.post<IOrderChange[],IOrderChangeSearchForm>(`/groupApi/Orders/GetChangeLists/${page}/${pageSize}`,form)
export const getChangesListGroup = ({page,pageSize}:{page:number,pageSize:number},form:IOrderChangeSearchForm) => axios.post<IOrderChangeCount,IOrderChangeSearchForm>(`/groupApi/Orders/GetChangesList/${page-1}/${pageSize}`,form)
export const exportChangeListsGroup = (form:IOrderChangeSearchForm) => axios.post<Blob,IOrderChangeSearchForm>(`/groupApi/Orders/ExportChangeLists`,form,{responseType: 'blob'})

// 获取改签列表
export const getChangeInfosGroup = (id:string) => axios.get<IChange[]>(`/groupApi/Orders/GetChangeInfos/${id}`)
// 获取改签信息
export const getChangeInfoGroup = (id:string) => axios.get<IChange>(`/groupApi/Orders/GetChangeInfo/${id}`)

export const downloadChangeFileGroup = (id:string) => axios.get<Blob>(`/groupApi/Orders/DownloadChangeFile/${id}`,{},{responseType: 'blob'})
export const deleteChangeFileGroup = (id:string) => axios.del<CommonResponseAgent>(`/groupApi/Orders/DeleteChangeFile/${id}`)
export const uploadChangeFilesGroup = (form:{
    id: string
    remarks: string
    formFiles: {
        file: File
    }[]
}) => {
    const formData = new FormData()
    formData.append('ChangeId', form.id)
    formData.append('Remarks', form.remarks)
    form.formFiles.forEach(file => {
        formData.append('FormFiles', file.file)
    })
    return axios.axiosFormData<CommonResponseAgent>(`/groupApi/Orders/UploadChangeFiles`,formData,'post')
}

// 添加机票采购单内容
export const addBookingOrderGoup = (id:string ,from: BookingAddForm) => axios.post<CommonResponseGroup,BookingAddForm>(`/groupApi/Orders/AddBookingOrder/${id}`,from)
// 更新机票采购单内容
export const updateBookingOrderGroup = (id:string ,from: BookingAddForm) => axios.patch<CommonResponseGroup,BookingAddForm>(`/groupApi/Orders/UpdateBookingOrder/${id}`,from)
// 删除机票采购单内容
export const deleteBookingOrderGroup = (id:string ) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingOrder/${id}`)

// 添加采购废票单内容
export const addBookingVoidedGroup = (id:string,form:BookingVoidedForm) => axios.post<CommonResponseGroup,BookingVoidedForm>(`/groupApi/Orders/AddBookingVoided/${id}`,form)
// 更新采购废票单内容
export const updateBookingVoidedGroup = (id:string,form:BookingVoidedForm) => axios.patch<CommonResponseGroup,BookingVoidedForm>(`/groupApi/Orders/UpdateBookingVoided/${id}`,form)
// 删除采购废票单内容
export const deleteBookingVoidedGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingVoided/${id}`)

// 废票询价
export const voidedConsultGroup = (id:string) => axios.post<VoidCommonResponseGroup>(`/groupApi/Service/VoidedConsult/${id}`)
export const bookingVoidedGroup = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Service/BookingVoided/${id}`)
// 添加采购单退票内容
export const addBookingRefundGroup = (id:string,form:BookingRefundForm) => axios.post<CommonResponseGroup,BookingRefundForm>(`/groupApi/Orders/AddBookingRefund/${id}`,form)
// 更新采购单退票内容
export const updateBookingRefundGroup = (id:string,form:BookingRefundForm) => axios.patch<CommonResponseGroup,BookingRefundForm>(`/groupApi/Orders/UpdateBookingRefund/${id}`,form)
// 删除采购单退票内容
export const deleteBookingRefundGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingRefund/${id}`)


// 添加采购单辅营内容
export const addBookingAppendGroup = (id:string,form:BookingAuxiliaryForm) => axios.post<CommonResponseGroup,BookingAuxiliaryForm>(`/groupApi/Orders/AddBookingAppend/${id}`,form)
// 更新采购单辅营内容
export const updateBookingAppendGroup = (id:string,form:BookingAuxiliaryForm) => axios.patch<CommonResponseGroup,BookingAuxiliaryForm>(`/groupApi/Orders/UpdateBookingAppend/${id}`,form)
// 删除采购单辅营内容
export const deleteBookingAppendGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingAppend/${id}`)

// 添加采购改签单内容
export const addBookingChangeGroup = (id:string,form:BookingChangeForm) => axios.post<CommonResponseGroup,BookingChangeForm>(`/groupApi/Orders/AddBookingChange/${id}`,form)
// 更新采购改签单内容
export const updateBookingChangeGroup = (id:string,form:BookingChangeForm) => axios.patch<CommonResponseGroup,BookingChangeForm>(`/groupApi/Orders/UpdateBookingChange/${id}`,form)
// 删除采购改签单内容
export const deleteBookingChangeGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingChange/${id}`)


// 获取采购单列表
export const getBookingOrdersGroup = (id:string) => axios.get<BookingOrder[]>(`/groupApi/Orders/GetBookingOrders/${id}`)
// 获取采购单详情
export const getBookingOrderGroup = (id:string) => axios.get<BookingOrder>(`/groupApi/Orders/GetBookingOrder/${id}`)
// 获取采购单废票单列表
export const getBookingVoidedsGroup = (id:string) => axios.get<IBookingVoided[]>(`/groupApi/Orders/GetBookingVoideds/${id}`)
// 获取采购单退票单列表
export const getBookingRefundsGroup = (id:string) => axios.get<IBookingRefund[]>(`/groupApi/Orders/GetBookingRefunds/${id}`)
// 获取采购单改签单列表
export const getBookingChangesGroup = (id:string) => axios.get<IBookingChange[]>(`/groupApi/Orders/GetBookingChanges/${id}`)
// 获取采购单辅营单列表
export const getBookingAppendsGroup = (id:string) => axios.get<IBookingAuxiliary[]>(`/groupApi/Orders/GetBookingAppends/${id}`)


// 修改订单状态
export const changeOrderStatusGroup = (id: string,statusType:ITicketStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeOrderStatus/${id}/${statusType}`)
export const changeRefundStatusGroup = (id: string,statusType:IRefundStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeRefundStatus/${id}/${statusType}`)
export const changeChangeStatusGroup = (id: string,statusType:IChangeStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeChangeStatus/${id}/${statusType}`)
export const changeAppendStatusGroup = (id: string,statusType:IAuxiliaryStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeAppendStatus/${id}/${statusType}`)

// 采购单修改订单状态
export const changeBookingOrderStatusGroup = (id: string,statusType:BookingStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeBookingOrderStatus/${id}/${statusType}`)
export const changeBookingVoidedStatusGroup = (id: string,statusType:VoidingStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeBookingVoidedStatus/${id}/${statusType}`)
export const changeBookingRefundStatusGroup = (id: string,statusType:RefundStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeBookingRefundStatus/${id}/${statusType}`)
export const changeBookingChangeStatusGroup = (id: string,statusType:ChangeStatus) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeBookingChangeStatus/${id}/${statusType}`)
export const changeBookingAppendStatusGroup = (id: string,statusType:IAuxiliaryStatusBooking) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeBookingAppendStatus/${id}/${statusType}`)

// 退款单执行退款操作
export const paymentRefundGroup = (id: string) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/RefundPayment/${id}`)


// 锁单操作
export const changeOrderLockedByGroup = (id: string,isLocked:boolean) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeOrderLockedBy/${id}/${isLocked}`)
export const changeRefundLockedByGroup = (id: string,isLocked:boolean) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeRefundLockedBy/${id}/${isLocked}`)
export const changeChangeLockedByGroup = (id: string,isLocked:boolean) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeChangeLockedBy/${id}/${isLocked}`)
export const changeAppendLockedByGroup = (id: string,isLocked:boolean) => axios.patch<CommonResponseGroup>(`/groupApi/Orders/ChangeAppendLockedBy/${id}/${isLocked}`)

// 添加订单乘客票号
export const addOrderTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.post<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/AddOrderTicketNumber/${id}`,form)
// 更新订单乘客票号
export const updateOrderTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.patch<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/UpdateOrderTicketNumber/${id}`,form)
// 删除订单乘客票号
export const deleteOrderTicketNumberGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteOrderTicketNumber/${id}`)

// 添加采购单乘客票号
export const addBookingTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.post<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/AddBookingTicketNumber/${id}`,form)
// 更新采购单乘客票号
export const updateBookingTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.patch<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/UpdateBookingTicketNumber/${id}`,form)
// 删除采购单乘客票号
export const deleteBookingTicketNumberGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingTicketNumber/${id}`)

// 添加采购单改签乘客票号
export const addBookingChangeTicketGroup = (id:string,form:TicketNumberForm) => axios.post<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/AddBookingChangeTicket/${id}`,form)
// 更新采购单改签乘客票号
export const updateBookingChangeTicketGroup = (id:string,form:TicketNumberForm) => axios.patch<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/UpdateBookingChangeTicket/${id}`,form)
// 删除采购单改签乘客票号
export const deleteBookingChangeTicketGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteBookingChangeTicket/${id}`)


// 添加改签单乘客票号
export const addChangeTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.post<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/AddChangeTicketNumber/${id}`,form)
// 更新改签单乘客票号
export const updateChangeTicketNumberGroup = (id:string,form:TicketNumberForm) => axios.patch<CommonResponseGroup,TicketNumberForm>(`/groupApi/Orders/UpdateChangeTicketNumber/${id}`,form)
// 删除改签单乘客票号
export const deleteChangeTicketNumberGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Orders/DeleteChangeTicketNumber/${id}`)


// 添加金额

// 添加或修改订单金额
export const upsertOrderAmountsGroup = (form:UpOrderAmounts,confirmed:boolean) => axios.put<CommonResponseGroup,UpOrderAmounts>(`/groupApi/Orders/UpsertOrderAmounts/${confirmed}`,form)
// 添加或修改退票金额
export const upsertRefundAmountsGroup = (form:UpOrderRCAmounts,confirmed:boolean) => axios.put<CommonResponseGroup,UpOrderRCAmounts>(`/groupApi/Orders/UpsertRefundAmounts/${confirmed}`,form)
// 添加或修改改签金额
export const upsertChangeAmountsGroup = (form:UpOrderRCAmounts,confirmed:boolean) => axios.put<CommonResponseGroup,UpOrderRCAmounts>(`/groupApi/Orders/UpsertChangeAmounts/${confirmed}`,form)
// 追加订单支付记录项
export const appendOrderPaymentGroup = (id:string,form:PaymentOrder) => axios.post<CommonResponseGroup,PaymentOrder>(`/groupApi/Orders/AppendOrderPayment/${id}`,form)
//
export const appendRefundPaymentGroup = (id:string,form:PaymentOrder) => axios.post<CommonResponseGroup,PaymentOrder>(`/groupApi/Orders/AppendRefundPayment/${id}`,form)


export const appendChangePaymentGroup = (id:string,form:PaymentOrder) => axios.post<CommonResponseGroup,PaymentOrder>(`/groupApi/Orders/AppendChangePayment/${id}`,form)



// 主订单出票驳回
export const orderRejectGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/OrderReject/${id}`,form)
// 驳回主订单金额确认
export const rejectOrderAmountsGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/RejectOrderAmounts/${id}`,form)
// 驳回退票单金额确认
export const rejectRefundAmountsGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/RejectRefundAmounts/${id}`,form)
// 退款单执行驳回操作
export const refundRejectGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/RefundReject/${id}`,form)
// 改签单执行驳回操作
export const changeRejectGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/ChangeReject/${id}`,form)
// 驳回改签单金额确认
export const rejectChangeAmountsGroup = (id:string,form:{message:string}) => axios.patch<CommonResponseGroup,{message:string}>(`/groupApi/Orders/RejectChangeAmounts/${id}`,form)

// 添加采购支付记录项
export const addBookingOrderPaymentGroup = (id:string,form:IPolicyPaymentForm) => axios.post<CommonResponseGroup,IPolicyPaymentForm>(`/groupApi/Orders/AddBookingOrderPayment/${id}`,form)
// 添加采购支付记录项
export const addBookingVoidedPaymentGroup = (id:string,form:IPolicyPaymentForm) => axios.post<CommonResponseGroup,IPolicyPaymentForm>(`/groupApi/Orders/AddBookingVoidedPayment/${id}`,form)
// 添加采购支付记录项
export const addBookingRefundPaymentGroup = (id:string,form:IPolicyPaymentForm) => axios.post<CommonResponseGroup,IPolicyPaymentForm>(`/groupApi/Orders/AddBookingRefundPayment/${id}`,form)
// 添加采购支付记录项
export const addBookingChangePaymentGroup = (id:string,form:IPolicyPaymentForm) => axios.post<CommonResponseGroup,IPolicyPaymentForm>(`/groupApi/Orders/AddBookingChangePayment/${id}`,form)
// 添加采购支付记录项
export const addBookingAppendPaymentGroup = (id:string,form:IPolicyPaymentForm) => axios.post<CommonResponseGroup,IPolicyPaymentForm>(`/groupApi/Orders/AddBookingAppendPayment/${id}`,form)

export const exportBookingPaymentsGroup = (form:ISearchBookingPayment) => axios.post<Blob,ISearchBookingPayment>(`/groupApi/Configs/ExportBookingPayments`,form,{responseType: 'blob'})
// 获取日志信息列表
export const getOperationLogsOrderGroup = ({page,pageSize}:{page:number,pageSize:number},id:string) => axios.get<OrderInfo[]>(`/groupApi/Orders/GetOperationLogs/${id}/${page}/${pageSize}`)



// 主订单出票询价
export const bookingQuoteGroup = (id:string,form: BookingQuoteSearch) => axios.post<FQueryResult[],BookingQuoteSearch>(`/groupApi/Service/BookingQuote/${id}`,form)

// 采购单创建操作
export const bookingCreateGroup = (id:string,form:QueryResultCreate) => axios.post<CommonResponseGroup,QueryResultCreate>(`/groupApi/Service/BookingCreate/${id}`,form)

// 采购单取消操作
export const bookingCancelGroup = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Service/BookingCancel/${id}`)

// 采购单支付操作
export const bookingPayingGroup = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Service/BookingPaying/${id}`)

// 采购单票号操作
export const bookingTicketGroup = (id:string) => axios.patch<CommonResponseGroup>(`/groupApi/Service/BookingTicket/${id}`)



// 获取当前退票单数量
export const getRefundQuantityGroup = () => axios.get<Record<IRefundStatus, number>>(`/groupApi/Orders/GetRefundQuantity`)

// 获取当前改签单数量
export const getChangeQuantityGroup = () => axios.get<Record<IChangeStatus, number>>(`/groupApi/Orders/GetChangeQuantity`)

// 获取当前主订单数据
export const getOrderQuantityGroup = () => axios.get<Record<ITicketStatus, number>>(`/groupApi/Orders/GetOrderQuantity`)

// 获取当前辅营订单数据
export const getAppendQuantityGroup = () => axios.get<Record<IAuxiliaryStatus, number>>(`/groupApi/Orders/GetAppendQuantity`)

export const fuzzyQueryGlobalAirportsGroup = (msg:string) => axios.get<QueryGlobalAirports[]>(`/groupApi/Configs/FuzzyQueryGlobalAirports/${msg}/20`)


// 采购单退票询价
export const refundConsultGroup = (id:string,form:PurchaseRefund) => axios.post<PurchaseRefundResponseGroup,PurchaseRefund>(`/groupApi/Service/RefundConsult/${id}`,form)
export const bookingRefundGroup = (id:string,form:PurchaseRefund) => axios.patch<CommonResponseGroup,PurchaseRefund>(`/groupApi/Service/BookingRefund/${id}`,form)


// 推送订单通知
export const pushOrderNotifyGroup = (id:string,form:IPushNotify) => axios.post<CommonResponseGroup,IPushNotify>(`/groupApi/Orders/PushOrderNotify/${id}`,form)
export const pushRefundNotifyGroup = (id:string,form:IPushNotify) => axios.post<CommonResponseGroup,IPushNotify>(`/groupApi/Orders/PushRefundNotify/${id}`,form)
export const pushChangeNotifyGroup = (id:string,form:IPushNotify) => axios.post<CommonResponseGroup,IPushNotify>(`/groupApi/Orders/PushChangeNotify/${id}`,form)
export const pushAppendNotifyGroup = (id:string,form:IPushNotify) => axios.post<CommonResponseGroup,IPushNotify>(`/groupApi/Orders/PushAppendNotify/${id}`,form)
export const updateNotifyMessageGroup = (id:string,form:IPushNotify) => axios.post<CommonResponseGroup,IPushNotify>(`/groupApi/Orders/UpdateNotifyMessage/${id}`,form)
export const appendReplenishLogGroup = (id:string,form:AppendReplenishLogForm) => axios.post<CommonResponseGroup,AppendReplenishLogForm>(`/groupApi/Orders/AppendReplenishLog/${id}`,form)


//
export const getNotifyMessagesGroup = ({page,pageSize}:{page:number,pageSize:number},form:PushSearch) => axios.post<PushInfo[] ,PushSearch>(`/groupApi/Orders/GetNotifyMessages/${page}/${pageSize}`,form)
export const getNotifyMessagesIndexGroup = (indexId:string) => axios.get<PushInfo[]>(`/groupApi/Orders/GetNotifyMessages/${indexId}`)



export const getDashboardTodayGroup = (form:DashboardTotalForm) => axios.post<DashboardTotal,DashboardTotalForm>(`/groupApi/Report/GetDashboardToday`,form)
export const getDashboardTotalGroup = (form:DashboardTotalForm) => axios.post<DashboardTotal,DashboardTotalForm>(`/groupApi/Report/GetDashboardTotal`,form)
export const getDashboardScaleGroup = (form:DashboardScaleForm) => axios.post<DashboardScale,DashboardScaleForm>(`/groupApi/Report/GetDashboardScale`,form)
export const exportDashboardDataGroup = (form:DashboardTotalForm) => axios.post<Blob,DashboardTotalForm>(`/groupApi/Report/ExportDashboardData`,form,{responseType: 'blob'})


export const bookingDetailGroup = (id:string) => axios.post<CommonResponseOrder>(`/groupApi/Service/BookingDetail/${id}`)


// 采购单辅营查询
export const appendConsultGroup = (id:string,form:{seekTypes:ISeekType[]}) => axios.post<AppendConsult,{seekTypes:ISeekType[]}>(`/groupApi/Service/AppendSeeking/${id}`,form)
export const bookingAppendGroup = (id:string,form:AppendConsultForm) => axios.patch<CommonResponseGroup,AppendConsultForm>(`/groupApi/Service/BookingAppend/${id}`,form)


// 公告信息
export const getBulletinInfoGroup = (id:string) => axios.get<Document>(`/groupApi/Policies/GetBulletinInfo/${id}`)
export const getBulletinInfosGroup = ({page,pageSize}:{page:number,pageSize:number},form:DocSearch) => axios.post<DocListItem,DocSearch>(`/groupApi/Policies/GetBulletinInfos/${page-1}/${pageSize}`,form)
export const addBulletinInfoGroup = (form:DocForm) => axios.post<CommonResponseGroup,DocForm>(`/groupApi/Policies/AddBulletinInfo`,form)
export const updateBulletinInfoGroup = (form:DocForm) => axios.patch<CommonResponseGroup,DocForm>(`/groupApi/Policies/UpdateBulletinInfo`,form)
export const deleteBulletinInfoGroup = (id:string) => axios.del<CommonResponseGroup>(`/groupApi/Policies/DeleteBulletinInfo/${id}`)

export const uploadGroup = (file:File) => {
    const formData = new FormData()
    formData.append('FormFile',file)
    return axios.axiosFormData<CommonResponseUpload>(`/transferApi/Group/SmbFile/Upload`,formData,'post')
}

export const delsertChannelCodeGroup = (form:ChannelCode) => axios.patch<CommonResponseGroup,ChannelCode>(`/groupApi/Configs/DelsertChannelCode`,form)
