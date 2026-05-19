import {TabBar} from "antd-mobile";
import {AppOutline} from "antd-mobile-icons";

const tabs = [
  {
    key: '/',
    title: '首页',
    icon: <AppOutline />,
  },
  {
    key: '/ticketOrder',
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
  return (
    <div className={'lg:w-(--container-width) w-full fixed left-[50%] transform-[translateX(-50%)] bottom-0 h-(--header-height) bg-(--bg)'}>
      <TabBar>
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
