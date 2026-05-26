import {useMemo} from "react";
import {useLocation, useNavigate} from "react-router";

import {TabBar} from "antd-mobile";
import {AppOutline} from "antd-mobile-icons";

const tabs = [
  {
    key: 'home',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: 'order',
    title: '订单',
    icon: <AppOutline />,
  },
  {
    key: 'agent',
    title: '代理',
    icon: <AppOutline />,
  },
  {
    key: 'rechargePayment',
    title: '充值',
    icon: <AppOutline />,
  },
]

export default function TabBarComponent(){
  const location = useLocation();
  const navigate = useNavigate()
  const {pathname} = location

  const activeTab = useMemo(() => {
    switch (true){
      case (['/' , '/data/sale' , '/data/retrieval'].includes(pathname)):
        return 'home'
      case pathname.includes('order'):
        return 'order'
      default:
        return 'home'
      case pathname.includes('/group/agent'):
        return 'agent'
      case pathname.includes('/group/rechargePayment'):
        return 'rechargePayment'
    }
  },[pathname])

  const changeTab = (val: string) => {
    switch (val){
      case 'home':
        navigate('/')
        break
      case 'order':
        navigate('/order/ticket')
        break
      case 'agent':
        navigate('/group/agent')
        break
      case 'rechargePayment':
        navigate('/group/rechargePayment')
        break
    }
  }
  return (
    <div className={'lg:w-(--container-width) w-full fixed left-[50%] transform-[translateX(-50%)] bottom-0 h-(--header-height) bg-(--bg)'}>
      <TabBar activeKey={activeTab} onChange={changeTab}>
        {
          tabs.map(item => (
            <TabBar.Item key={item.key}
                         icon={item.icon}
                         title={item.title} />
          ))
        }
      </TabBar>
    </div>
  )
}
