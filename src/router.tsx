import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import {AgentLoad, FoundationBookingLoad, HomeLoad, AgentRechargePaymentLoad} from "./routerMenu.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path: '',
        element: <HomeLoad/>
      },
      {
        path: 'group/agent',
        element: <AgentLoad/>
      },
      {
        path: 'group/rechargePayment',
        element: <AgentRechargePaymentLoad/>
      },
      {
        path:'group/foundation/booking',
        element: <FoundationBookingLoad />
      }
    ]
  }
], {basename: '/h5'})
