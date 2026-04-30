import {lazy} from "react";

export const HomeLoad = lazy(() => import('@/app/dashboard/index'));
export const AgentLoad = lazy(() => import('@/app/agent/index'));
export const AgentRechargePaymentLoad = lazy(() => import('@/app/agent/rechargePayment.tsx'));
export const FoundationBookingLoad = lazy(() => import('@/app/foundation/booking.tsx'));
