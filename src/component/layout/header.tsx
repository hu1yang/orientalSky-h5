import {useLocation, useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import type {RootState} from "@/store";
import {setNotifyVisible} from "@/store/modules/menu.ts";
import {useTranslation} from "react-i18next";

import {Avatar, Button, Space} from "antd-mobile";
import {BellOutline} from "antd-mobile-icons";

export default function Header() {
  const location = useLocation()
  const navigate = useNavigate()
  const {pathname} = location
  const {identity} = useSelector((state: RootState) => state.toolInfo);
  const {notifyList} = useSelector((state: RootState) => state.menuInfo);
  const dispatch = useDispatch()

  const openNotify = () => {
    if(notifyList.length > 0){
      dispatch(setNotifyVisible(true))
    }
  }

  const {t} = useTranslation()

  return (
    <div
      className={'lg:w-(--container-width) w-full px-(--layout-padding) h-(--header-height) bg-(--bg) fixed left-[50%] transform-[translateX(-50%)] top-0 z-99'}>
      <div className={'w-full flex items-center h-full'}>
        <div className={'flex justify-between w-full items-center'}>
          {
            pathname === '/setting' ?
              <div className={'flex items-center'}>
                <h2 className={'ml-4 !text-[1.4rem]'}>{t('common.setAccount')}</h2>
              </div>:
              <div className={'flex items-center'} onClick={() => {navigate('/group/personal')}}>
                <Avatar src='' style={{'--border-radius': '10px', '--size': '35px'}}/>
                <h2 className={'ml-4 !text-[1.4rem]'}>{identity?.actualName || ''}</h2>
              </div>
          }
          <div className={'flex items-center'}>
            <Space>
              {
                !!notifyList.length && (
                  <Button color='default' fill='none' style={{padding: '4px 5px'}} onClick={openNotify}>
                    <BellOutline className={'[--from:#ff9f43] [--to:#ff6b6b] animate-pulse-color'} fontSize={18}/>
                  </Button>
                )
              }
            </Space>
          </div>
        </div>
      </div>
    </div>
  )
}
