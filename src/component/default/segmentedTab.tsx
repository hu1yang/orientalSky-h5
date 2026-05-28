import {memo, useMemo} from "react";
import {Outlet, useLocation, useNavigate} from "react-router";

import {Segmented} from "antd-mobile";
import {useTranslation} from "react-i18next";

export default memo(function SegmentedTab(
    {
      type
    }: { type: 'dashboard' | 'order' }
  ) {
    const location = useLocation()
    const navigate = useNavigate()
    const {pathname} = location
    const {t} = useTranslation()

    const changeSegmented = (val: string | number) => {
      navigate(String(val))
    }

    const optionsMemo = useMemo(() => {
      switch (type) {
        case 'dashboard':
          return [{label: t('common.todayDate'), value: '/'}, {
            label: t('common.routerSalesData'),
            value: '/data/sale'
          }, {label: t('common.routerDataRetrieval'), value: '/data/retrieval'}]
        case 'order':
          return [{label: t('common.routerTicketing'), value: '/order/ticket'}, {
            label: t('common.routerRefund'),
            value: '/order/refund'
          }, {label: t('common.routerChange'), value: '/order/change'}, {
            label: t('common.routerAuxiliary'),
            value: '/order/auxiliary'
          }]
      }
    }, [type])

    return (
      <section className={'containerMain'}>
        <div className={'w-full mb-2 bg-(--bg) sticky top-(--header-height) left-0 z-9'}>
          <Segmented block options={optionsMemo} value={pathname} onChange={changeSegmented}/>
        </div>
        <Outlet/>
      </section>
    )
  }
)
