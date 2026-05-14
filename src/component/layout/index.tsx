import {Suspense, useEffect, useState} from "react";
import {Outlet} from "react-router";
import {useDispatch} from "react-redux";
import {setBranchAgents, setBranchMore, setChannel} from "@/store/modules/base.ts";

import Cookie from 'js-cookie'
import {SafeArea} from "antd-mobile";
import Header from "./header.tsx";
import {getBranchAgents, getGroupBranchs} from "@/utils/request/identity.ts";
import {getChannelSettingsGroup} from "@/utils/request/group.ts";

export default function Layout(){
  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()

  const getBranchAgent = async () => {
    const [agents, more] = await Promise.all([
      getBranchAgents(),
      getGroupBranchs()
    ])
    dispatch(setBranchAgents(agents))
    dispatch(setBranchMore(more))
    setLoading(false)
  }

  const getChannel = async () => {
    const response = await getChannelSettingsGroup()
    dispatch(setChannel(response))
  }


  useEffect(() => {
    const init = async () => {
      if (!Cookie.get('token')) return

      // await getBranchAgent()
      // await getChannel()

      // 需删除
      setLoading(false)
    }

    init()
  }, [])

  return (
      <div className={'pt-(--header-height)'}>
        <div style={{ background: '#ace0ff' }}>
          <SafeArea position='top' />
        </div>
        <Header />
        <main>
          <Suspense fallback={<div>loading...</div>}>
            {
              loading ? <div>loading...</div> :
                <Outlet />
            }
          </Suspense>
        </main>
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>
  )
}
