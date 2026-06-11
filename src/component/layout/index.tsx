import {Suspense, useEffect, useState} from "react";
import {Outlet, useMatches, useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {setBranchAgents, setBranchMore, setChannel} from "@/store/modules/base.ts";
import {setIdentity} from "@/store/modules/tool.ts";
import {useTranslation} from "react-i18next";

import Cookie from 'js-cookie'
import {NavBar, SafeArea} from "antd-mobile";
import Header from "./header.tsx";
import TabBarComponent from "./tabbar.tsx";

import {getBranchAgents, getGroupBranchs, getIdentity} from "@/utils/request/identity.ts";
import {getChannelSettingsGroup} from "@/utils/request/group.ts";

export default function Layout({noDefault}:{
  noDefault?: boolean
}){
  const navigate = useNavigate();
  const matches = useMatches()
  const currentRoute = matches[matches.length - 1]
  const title = currentRoute?.handle?.title || ''

  const {t} = useTranslation()

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

  const onBack = () => {
    navigate(-1)
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
      <div className={`${!noDefault ? 'pt-(--header-height)':'py-(--header-height)'}`}>
        <div style={{ background: '#ace0ff' }}>
          <SafeArea position='top' />
        </div>
        {
          noDefault ?
            <Header />:
            <div className={'lg:w-(--container-width) w-full h-(--header-height) bg-(--bg) fixed left-[50%] transform-[translateX(-50%)] top-0 z-999'}>
              <NavBar onBack={onBack} style={{lineHeight: 1.6}}>{t(title)}</NavBar>
            </div>
        }
        <main>
          <Suspense fallback={<div>loading...</div>}>
            {
              loading ? <div>loading...</div> :
                <Outlet />
            }
          </Suspense>
        </main>
        {
          noDefault &&
            <TabBarComponent />
        }
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>
  )
}
