import {createBrowserRouter} from "react-router";

import Layout from "@/component/layout";
import {AgentLoad} from "./routerMenu.ts";

export const router = createBrowserRouter([
  {
    path: "/",
    element:<Layout />,
    children:[
      {
        path:'group/agent',
        element: <AgentLoad />
      }
    ]
  }
],{basename:'/h5'})
