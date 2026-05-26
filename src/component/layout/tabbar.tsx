import {useMatches, useNavigate} from "react-router";

import {TabBar} from "antd-mobile";

const tabs = [
  {
    key: 'dashboard',
    title: '首页',
    icon: <i className={'iconfont icon-Dashboard text-[1.8rem]!'} />,
  },
  {
    key: 'order',
    title: '订单',
    icon: <i className={'iconfont icon-dingdan1 text-[1.8rem]!'} />,
  },
  {
    key: 'agent',
    title: '代理',
    icon: <i className={'iconfont icon-personal text-[1.8rem]!'} />,
  },
  {
    key: 'setting',
    title: '设置',
    icon: <i className={'iconfont icon-shezhi text-[1.8rem]!'} />,
  },
]

export default function TabBarComponent(){
  const matches = useMatches()
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
                         title={item.title} />
          ))
        }
      </TabBar>
    </div>
  )
}
