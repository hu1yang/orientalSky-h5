import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import SegmentedTab from "./component/default/segmentedTab.tsx";
import {
  AgentLoad,
  FoundationBookingLoad,
  HomeLoad,
  AgentRechargePaymentLoad,
  AgentInfoLoad,
  OrderListLoad, OrderDetailLoad, RetrievalLoad, LoginLoad, SettingLoad, PersonalLoad, CompanyLoad, UserLoad
} from "./routerMenu.ts";


export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout noDefault={true} />,
    children: [
      {
        path:'/',
        element: <SegmentedTab />,
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
        path:'/order/:orderType',
        element: <OrderListLoad />,
        handle:{
          routerType: 'order'
        }
      },
      {
        path:'/group/agent',
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
        path: 'group/',
        children: [
          {
            path: 'company',
            element: <CompanyLoad />,
            handle: {
              title: 'common.routerCompanyList'
            }
          },
          {
            path: 'user/:branchId?',
            element: <UserLoad />,
            handle: {
              title: 'common.routerCompanyUser'
            }
          },
          {
            path: 'rechargePayment',
            element: <AgentRechargePaymentLoad/>,
            handle: {
              title: 'common.routerRechargePaymentRecord'
            }
          },
          {
            path:'foundation/booking',
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
          {
            path: 'personal',
            element: <PersonalLoad/>,
            handle: {
              title: 'common.routerPersonal'
            }
          },
          {
            path:'agent/:id',
            element: <AgentLoad/>,
            handle:{
              title: 'common.routerAgency'
            }
          },
        ]
      },

    ]
  },
  {
    path:'/login',
    element: <LoginLoad />
  }
], {basename: '/h5'})
