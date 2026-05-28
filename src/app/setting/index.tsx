import {useMemo} from "react";
import {useNavigate} from "react-router";
import {useDispatch, useSelector} from "react-redux";
import {removeLogin} from "@/store/modules/tool.ts";
import type {RootState} from "@/store";
import {useTranslation} from "react-i18next";

import {Avatar, Button, Dialog, List, Space, Tag} from "antd-mobile";
import {selectGroupMap} from "@/store/modules/base.ts";
import {GlobalOutline, PayCircleOutline, TruckOutline} from "antd-mobile-icons";
import {userSignOut} from "@/utils/request/identity.ts";

export default function Setting() {
  const navigate = useNavigate()

  const {t,i18n} = useTranslation();

  const {identity} = useSelector((state: RootState) => state.toolInfo);
  const groupMap = useSelector(selectGroupMap)
  const dispatch = useDispatch()

  const branchCodes = useMemo(() => {
    return (identity?.branchIds as string[])?.map(branchId => {
      const branch = groupMap.get(branchId)
      return branch.branchCode
    })
  },[identity?.branchIds,groupMap])

  const logout = async () => {
    const response = await userSignOut()
    if(response.succeeded){
      dispatch(removeLogin())
    }
  }


  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        <div className={'mb-5'}>
          <List mode={'card'} className={'m-auto!'}>
            <List.Item onClick={() => {navigate('/group/personal')}}>
              <div className={'flex items-start'}>
                <Avatar src='' style={{'--border-radius': '10px', '--size': '45px'}}/>
                <div className={'ml-4 flex-1'}>
                  <h2 className={'!text-[1.4rem]'}>{identity?.actualName || ''}</h2>
                  <span className={'text-[1rem] text-(--text)'}>{identity?.roleNames.join(',')}</span>
                  <Space wrap style={{
                    '--gap': '4px'
                  }}>
                    {
                      branchCodes.map((branchCode) => (
                        <Tag round color='#2db7f5' key={branchCode}>
                          {branchCode}
                        </Tag>
                      ))
                    }
                  </Space>
                </div>
              </div>
            </List.Item>
          </List>
        </div>
        <div className={'mb-5'}>
          <h3 className={'mb-2 font-medium text-(--text)'}>{t('common.routerFinance')}</h3>
          <List mode={'card'} className={'m-auto!'}>
            <List.Item prefix={<PayCircleOutline fontSize={18} />} onClick={() => {navigate('/group/rechargePayment')}}>{t('group.agentRecharge')}</List.Item>
          </List>
        </div>
        <div className={'mb-5'}>
          <h3 className={'mb-2 font-medium text-(--text)'}>{t('group.basicConfiguration')}</h3>
          <List mode={'card'} className={'m-auto!'}>
            <List.Item prefix={<TruckOutline fontSize={18} />} onClick={() => {navigate('/group/foundation/booking')}}>{t('order.purchasingAccount')}</List.Item>
            <List.Item prefix={<GlobalOutline fontSize={18} />} onClick={() => {
              Dialog.show({
                content: t('common.exitAccount'),
                closeOnAction: true,
                closeOnMaskClick: true,
                actions: [
                  {
                    key: 'en_US',
                    text: 'English',
                    onClick:() => {
                      i18n.changeLanguage('en_US');
                    }
                  },
                  {
                    key: 'zh_CN',
                    text: '中文',
                    onClick:() => {
                      i18n.changeLanguage('zh_CN');
                    }
                  },
                  {
                    key: 'ru_RU',
                    text: 'Russian',
                    onClick:() => {
                      i18n.changeLanguage('ru_RU');
                    }
                  },
                ]
              })
            }}>{t('common.language')}</List.Item>
          </List>
        </div>
        <div className={'mb-5'}>
          <Button block size={'middle'} color='primary' onClick={logout}>{t('common.exitAccount')}</Button>
        </div>
      </div>
    </section>
  )
}
