import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import SegmentedTab from "./component/default/segmentedTab.tsx";
import {
  AgentLoad,
  FoundationBookingLoad,
  HomeLoad,
  AgentRechargePaymentLoad,
  AgentInfoLoad,
  OrderListLoad, OrderDetailLoad, RetrievalLoad, LoginLoad, SettingLoad
} from "./routerMenu.ts";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout noDefault={true} />,
    children: [
      {
        path:'/',
        element: <SegmentedTab type={'dashboard'} />,
        children:[
          {
            path: '/',
            element: <HomeLoad/>,
            handle:{
              routerType: 'dashboard'
            }
          },
          {
            path: 'data/sale',
            element: <HomeLoad/>,
            handle:{
              routerType: 'dashboard'
            }
          },
          {
            path:'/data/retrieval',
            element: <RetrievalLoad />,
            handle:{
              routerType: 'dashboard'
            }
          }
        ]
      },
      {
        path:'/order/',
        element: <SegmentedTab type={'order'} />,
        children:[
          {
            path:'ticket/:status?',
            element: <OrderListLoad />,
            handle:{
              routerType: 'order'
            }
          },
          {
            path:'refund/:status?',
            element: <OrderListLoad />,
            handle:{
              routerType: 'order'
            }
          },
          {
            path:'change/:status?',
            element: <OrderListLoad />,
            handle:{
              routerType: 'order'
            }
          },
          {
            path:'auxiliary/:status?',
            element: <OrderListLoad />,
            handle:{
              routerType: 'order'
            }
          }
        ]
      },

      {
        path:'/group/agent/:id?',
        element: <AgentLoad/>,
        handle:{
          routerType: 'agent'
        }
      },
      {
        path:'/setting',
        element: <SettingLoad />,
        handle:{
          routerType: 'setting'
        }
      }
    ]
  },
  {
    path: "/",
    element: <Layout noDefault={false} />,
    children: [
      {
        path:'orderDetail/:orderId/:status?/:statusId?',
        element: <OrderDetailLoad />,
        handle: {
          title: 'common.routerOrderDetail'
        }
      },
      {
        path: 'group/rechargePayment',
        element: <AgentRechargePaymentLoad/>,
        handle: {
          title: 'common.routerRechargePaymentRecord'
        }
      },
      {
        path:'group/foundation/booking',
        element: <FoundationBookingLoad />,
        handle: {
          title: 'common.routerBookingAccountConfiguration'
        }
      },
      {
        path: 'agentDetail/:id',
        element: <AgentInfoLoad/>,
        handle: {
          title: 'common.routerAgency'
        }
      },
    ]
  },
  {
    path:'/login',
    element: <LoginLoad />
  }
], {basename: '/h5'})
