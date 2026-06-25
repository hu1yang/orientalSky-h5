import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import SegmentedTab from "./component/default/segmentedTab.tsx";
import {
  AgentLoad,
  FoundationBookingLoad,
  HomeLoad,
  AgentRechargePaymentLoad,
  AgentInfoLoad,
  OrderListLoad, OrderDetailLoad, RetrievalLoad, LoginLoad, SettingLoad, PersonalLoad, CompanyLoad, UserLoad,
  ChannelListLoad, ChannelBalanceLoad, ChannelPaymentLoad, BaseNation, BaseAirport, BaseWaypoint, BaseExrate
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
      {
        path:'channel/',
        children: [
          {
            path:'payment',
            element: <ChannelPaymentLoad />,
            handle:{
              title: 'common.routerChannelPayment'
            }
          },
          {
            path:'list',
            element: <ChannelListLoad />,
            handle:{
              title: 'common.routerChannelList'
            }
          },
          {
            path: 'balance',
            element: <ChannelBalanceLoad />,
            handle:{
              title: 'common.routerChannelBalance'
            }
          }
        ]
      },
      {
        path: 'base/',
        children: [
          {
            path:'nation',
            element: <BaseNation />,
            handle:{
              title: 'common.routerNation'
            }
          },
          {
            path:'airport',
            element: <BaseAirport />,
            handle: {
              title: 'common.routerAirport'
            }
          },
          {
            path:'waypoints',
            element: <BaseWaypoint />,
            handle: {
              title: 'common.routerWaypoints'
            }
          },
          {
            path:'exchangeRate',
            element: <BaseExrate />,
            handle: {
              title: 'common.routerExrate'
            }
          }
        ]
      }
    ]
  },
  {
    path:'/login',
    element: <LoginLoad />
  }
], {basename: '/h5'})
