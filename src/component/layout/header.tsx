import {useLocation} from "react-router";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useTranslation} from "react-i18next";

import {Avatar, Button, Space} from "antd-mobile";
import {BellOutline} from "antd-mobile-icons";

export default function Header() {
  const location = useLocation()
  const {pathname} = location
  const {identity} = useSelector((state: RootState) => state.toolInfo);

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
              <div className={'flex items-center'}>
                <Avatar src='' style={{'--border-radius': '10px', '--size': '35px'}}/>
                <h2 className={'ml-4 !text-[1.4rem]'}>{identity?.actualName || ''}</h2>
              </div>
          }

          {/*<div className={'flex items-center'}>*/}
          {/*  <Space>*/}
          {/*    <Button color='default' fill='none' style={{padding: '4px 5px'}}>*/}
          {/*      <BellOutline fontSize={18} />*/}
          {/*    </Button>*/}
          {/*  </Space>*/}
          {/*</div>*/}
        </div>
      </div>
    </div>
  )
}
