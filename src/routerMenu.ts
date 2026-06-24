import {lazy} from "react";

export const LoginLoad = lazy(() => import('@/app/login/index.tsx'));

export const HomeLoad = lazy(() => import('@/app/dashboard/index'));
export const RetrievalLoad = lazy(() => import('@/app/dashboard/retrieval.tsx'));


export const AgentLoad = lazy(() => import('@/app/agent/index'));
export const AgentRechargePaymentLoad = lazy(() => import('@/app/agent/rechargePayment.tsx'));
export const AgentInfoLoad = lazy(() => import('@/app/agent/info.tsx'));
export const FoundationBookingLoad = lazy(() => import('@/app/foundation/booking.tsx'));
export const CompanyLoad = lazy(() => import('@/app/company/index.tsx'));
export const UserLoad = lazy(() => import('@/app/company/user.tsx'));

export const OrderListLoad = lazy(() => import('@/app/order/orderList.tsx'));

export const OrderDetailLoad = lazy(() => import('@/app/order/detail.tsx'));

export const SettingLoad = lazy(() => import('@/app/setting/index.tsx'));
export const PersonalLoad = lazy(() => import('@/app/personal/index.tsx'))

export const ChannelPaymentLoad = lazy(() => import('@/app/channel/payment.tsx'));
export const ChannelListLoad = lazy(() => import('@/app/channel/list.tsx'));
export const ChannelBalanceLoad = lazy(() => import('@/app/channel/balance.tsx'));
