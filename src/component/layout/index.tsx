import {Suspense} from "react";
import {SafeArea} from "antd-mobile";
import Header from "./header.tsx";
import {Outlet} from "react-router";

export default function Layout(){
  return (
      <div>
        <div style={{ background: '#ace0ff' }}>
          <SafeArea position='top' />
        </div>
        <Header />
        <main>
          <Suspense fallback={<div>loading...</div>}>
            <Outlet />
          </Suspense>
        </main>
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>
  )
}
