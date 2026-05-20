import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import SegmentedTab from "@/component/dashboard/segmentedTab.tsx";
import {
  AgentLoad,
  FoundationBookingLoad,
  HomeLoad,
  AgentRechargePaymentLoad,
  AgentInfoLoad,
  OrderListLoad, OrderDetailLoad, RetrievalLoad
} from "./routerMenu.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout/>,
    children: [
      {
        path:'/',
        element: <SegmentedTab />,
        children:[
          {
            path: '/',
            element: <HomeLoad/>
          },
          {
            path: 'data/sale',
            element: <HomeLoad/>
          },
          {
            path:'/data/retrieval',
            element: <RetrievalLoad />
          }
        ]
      },
      {
        path:'/order/',
        children:[
          {
            path:'ticket/:status?',
            element: <OrderListLoad />
          },
        ]
      },
      {
        path:'ticketDetail/:orderId/:status?',
        element: <OrderDetailLoad />
      },
      {
        path: 'group/agent/:id?',
        element: <AgentLoad/>
      },
      {
        path: '/group/agent/configuration/:id/:branchId',
        element: <AgentInfoLoad/>
      },
      {
        path: 'group/rechargePayment',
        element: <AgentRechargePaymentLoad/>
      },
      {
        path:'group/foundation/booking',
        element: <FoundationBookingLoad />
      },
    ]
  }
], {basename: '/h5'})
