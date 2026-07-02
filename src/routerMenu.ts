import {lazy} from "react";

export const LoginLoad = lazy(() => import('@/app/login/index.tsx'));

export const HomeLoad = lazy(() => import('@/app/dashboard/index'));
export const RetrievalLoad = lazy(() => import('@/app/dashboard/retrieval.tsx'));


export const AgentLoad = lazy(() => import('@/app/agent/index'));
export const AgentInfoLoad = lazy(() => import('@/app/agent/info.tsx'));

export const FoundationBookingLoad = lazy(() => import('@/app/foundation/booking.tsx'));
export const FoundationPaymentLoad = lazy(() => import('@/app/foundation/payment.tsx'));


export const CompanyLoad = lazy(() => import('@/app/company/index.tsx'));
export const UserLoad = lazy(() => import('@/app/company/user.tsx'));

export const OrderListLoad = lazy(() => import('@/app/order/orderList.tsx'));

export const OrderDetailLoad = lazy(() => import('@/app/order/detail.tsx'));

export const SettingLoad = lazy(() => import('@/app/setting/index.tsx'));
export const PersonalLoad = lazy(() => import('@/app/personal/index.tsx'));

export const ChannelPaymentLoad = lazy(() => import('@/app/channel/payment.tsx'));
export const ChannelListLoad = lazy(() => import('@/app/channel/list.tsx'));
export const ChannelBalanceLoad = lazy(() => import('@/app/channel/balance.tsx'));

export const BaseNation = lazy(() => import('@/app/base/nation.tsx'));
export const BaseAirport = lazy(() => import('@/app/base/airport.tsx'));
export const BaseWaypoint = lazy(() => import('@/app/base/waypoint.tsx'));
export const BaseExrate = lazy(() => import('@/app/base/exrate.tsx'));


export const AgentRechargePaymentLoad = lazy(() => import('@/app/finance/rechargePayment.tsx'));
export const AgentRechargePaymentOnlineLoad = lazy(() => import('@/app/finance/rechargePaymentOnline.tsx'));
