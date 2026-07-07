import {type UIMatch, useMatches, useNavigate} from "react-router";

import {TabBar} from "antd-mobile";
import {useTranslation} from "react-i18next";

const tabs = [
  {
    key: 'dashboard',
    title: 'common.routerHome',
    icon: <i className={'iconfont icon-Dashboard text-[1.8rem]!'} />,
  },
  {
    key: 'order',
    title: 'order.order',
    icon: <i className={'iconfont icon-dingdan1 text-[1.8rem]!'} />,
  },
  {
    key: 'agent',
    title: 'common.routerAgent',
    icon: <i className={'iconfont icon-person1 text-[1.8rem]!'} />,
  },
  {
    key: 'setting',
    title: 'common.setting',
    icon: <i className={'iconfont icon-shezhi text-[1.8rem]!'} />,
  },
]

export default function TabBarComponent(){
  const {t} = useTranslation()
  const matches = useMatches() as UIMatch<unknown, {routerType: string}>[]
  const navigate = useNavigate()
  const currentRoute = matches[matches.length - 1]
  const routerType = currentRoute?.handle?.routerType || ''


  const changeTab = (val: string) => {
    switch (val){
      case 'dashboard':
        navigate('/')
        break
      case 'order':
        navigate('/order/ticket')
        break
      case 'agent':
        navigate('/group/agent')
        break
      case 'setting':
        navigate('/setting')
        break
    }
  }
  return (
    <div className={'lg:w-(--container-width) w-full fixed left-[50%] transform-[translateX(-50%)] bottom-0 h-(--header-height) bg-(--bg)'}>
      <TabBar activeKey={routerType} onChange={changeTab}>
        {
          tabs.map(item => (
            <TabBar.Item key={item.key}
                         icon={item.icon}
                         title={t(item.title)} />
          ))
        }
      </TabBar>
    </div>
  )
}
