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
  // {
  //   key: 'home',
  //   title: '首页',
  //   icon: <AppOutline />,
  // },
  // {
  //   key: 'home',
  //   title: '首页',
  //   icon: <AppOutline />,
  // },
]

export default function TabBarComponent(){
  const location = useLocation();
  const navigate = useNavigate()
  const {pathname} = location

  const activeTab = useMemo(() => {
    switch (true){
      case (['/' , '/data/sale' , '/data/retrieval'].includes(pathname)):
        return 'home'
      case !!pathname.indexOf('order'):
        return 'order'
      default:
        return 'home'
    }
  },[pathname])

  const changeTab = (val: string) => {
    switch (val){
      case 'home':
        navigate('/')
        break
      case 'order':
        navigate('/order/ticket')
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
