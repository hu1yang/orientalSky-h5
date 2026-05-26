import {Suspense, useEffect, useState} from "react";
import {Outlet, useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {setBranchAgents, setBranchMore, setChannel} from "@/store/modules/base.ts";
import {setIdentity} from "@/store/modules/tool.ts";

import Cookie from 'js-cookie'
import {SafeArea} from "antd-mobile";
import Header from "./header.tsx";
import TabBarComponent from "./tabbar.tsx";

import {getBranchAgents, getGroupBranchs, getIdentity} from "@/utils/request/identity.ts";
import {getChannelSettingsGroup} from "@/utils/request/group.ts";

export default function Layout(){
  const navigate = useNavigate();

  const [loading, setLoading] = useState<boolean>(true)
  const dispatch = useDispatch()

  const setIdentityFnc = async () => {
    const response = await getIdentity()
    dispatch(setIdentity(response))
  }

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
      if (!Cookie.get('token')) {
        navigate('/login')
      } else {
        await setIdentityFnc()
        await getBranchAgent()
        await getChannel()
      }
    }
    init()
  }, [])

  return (
      <div className={'py-(--header-height)'}>
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
        <TabBarComponent />
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>
  )
}
