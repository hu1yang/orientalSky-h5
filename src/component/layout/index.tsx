import {Suspense, useEffect, useState} from "react";
import {Outlet, type UIMatch, useLocation, useMatches, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {initAllOrders, notifyListSort, setNotifyVisible} from "@/store/modules/menu.ts";
import {setBranchAgents, setBranchMore, setChannel} from "@/store/modules/base.ts";
import {setIdentity} from "@/store/modules/tool.ts";
import {useTranslation} from "react-i18next";
import type {RootState} from "@/store";
import dayjs from "dayjs";

import Cookie from 'js-cookie'
import {Button, NavBar, Popup, SafeArea, Space, SpinLoading, Steps} from "antd-mobile";
import Header from "./header.tsx";
import TabBarComponent from "./tabbar.tsx";

import {getBranchAgents, getGroupBranchs, getIdentity} from "@/utils/request/identity.ts";
import {
  getAppendQuantityGroup,
  getChangeQuantityGroup,
  getChannelSettingsGroup,
  getOrderQuantityGroup,
  getRefundQuantityGroup
} from "@/utils/request/group.ts";
import {socketService} from "@/utils/socket.ts";
import {Step} from "antd-mobile/es/components/steps/step";
import type {InotifyList} from "@/types/order.ts";

export default function Layout({noDefault}:{
  noDefault?: boolean
}){
  const navigate = useNavigate();
  const {pathname} = useLocation()
  const matches = useMatches() as UIMatch<unknown, {title: string}>[]
  const currentRoute = matches[matches.length - 1]
  const title = currentRoute?.handle?.title || ''

  const {t} = useTranslation()

  const {notifyVisible} = useSelector((state: RootState) => state.menuInfo);
  const notifyList = useSelector(notifyListSort)
  const dispatch = useDispatch()

  const [loading, setLoading] = useState<boolean>(true)

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
    socketService.connect()
  }

  const getChannel = async () => {
    const response = await getChannelSettingsGroup()
    dispatch(setChannel(response))
  }

  const getOrderNumber = async () => {
    const [refund, change, order, append] = await Promise.all([
      getRefundQuantityGroup(),
      getChangeQuantityGroup(),
      getOrderQuantityGroup(),
      getAppendQuantityGroup(),
    ])

    dispatch(initAllOrders({
      ticketOrder: order,
      changeOrder: change,
      refundOrder: refund,
      auxiliaryOrder: append,
    }))
  }

  const onBack = () => {
    try {
      const canGoBack = window.history.state && window.history.state.idx > 0;
      if (canGoBack) {
        navigate(-1)
      } else {
        navigate('/')
      }
    } catch {
      navigate('/')
    }
  }

  const notifyFnc = (notify: InotifyList) => {
    if(notify.type === 'order'){
      let routertype = ''
      switch (notify.properties.OrderType) {
        case 'Append':
          routertype = 'auxiliary'
          break
        case 'Refund':
          routertype = 'refund'
          break
        case 'Change':
          routertype = 'change'
          break
      }
      if(routertype){
        navigate(`/orderDetail/${notify.properties.OrderId}/${routertype}`)
      }else{
        navigate(`/orderDetail/${notify.properties.OrderId}`)
      }
    }else if(notify.type === 'agentPayment'){
      navigate(`/finance/rechargePayment/${notify.properties.PaymentId}`)
    }else if(notify.type === 'channel'){
      navigate(`/channel/balance`)
    }else if(notify.type === 'channelPayment'){
      navigate(`/foundation/payment/${notify.properties.id}`)
    }else if(notify.type === 'channelAccount'){
      navigate(`/foundation/booking/${notify.properties.AccountId}`)
    }else if(notify.type === 'agent'){
      navigate(`/group/agent/${notify.properties.AgentId}`)
    }
    dispatch(setNotifyVisible(false))
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
  }, [pathname]);

  useEffect(() => {
    const init = async () => {
      if (!Cookie.get('token')) {
        navigate('/login')
      } else {
        await setIdentityFnc()
        await getBranchAgent()
        await getChannel()
        await getOrderNumber()
      }
    }
    init()
  }, [])

  const loadingNode = (
    <div className="h-[60vh] w-full flex items-center justify-center">
      <SpinLoading color="primary" />
    </div>
  )

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
          <Suspense fallback={loadingNode}>
            {
              loading ? loadingNode : <Outlet />
            }
          </Suspense>
        </main>
        {
          noDefault &&
            <TabBarComponent />
        }
        <Popup visible={notifyVisible} destroyOnClose position='right' showCloseButton onClose={() => dispatch(setNotifyVisible(false))}
               bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
          <div className={'py-20 px-5 h-full flex flex-col'}>
            <h2>{t('order.notifyMessageList')}</h2>
            <div className={'overflow-auto'}>
              <Steps direction='vertical'>
                {
                  notifyList.map((item) => (
                    <Step
                      key={item.broadcastId}
                      title={t('order.notifyMessage')}
                      status='finish'
                      description={
                        <Space block direction='vertical'>
                          <div className={'mt-2 text-[1.1rem]'}>
                            {item.messageBody}
                            <Button color='primary' size={'mini'} fill='none' onClick={() => notifyFnc(item)}>
                              {t('foundation.view')}
                            </Button>
                          </div>
                          <span>{dayjs(item.time).format('YYYY-MM-DD HH:mm:ss')}</span>
                        </Space>
                      }
                    />
                  ))
                }
              </Steps>
            </div>
          </div>
        </Popup>
        <div style={{ background: '#ffcfac' }}>
          <SafeArea position='bottom' />
        </div>
      </div>
  )
}
