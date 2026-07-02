import {Outlet, useLocation, useNavigate} from "react-router";
import {Segmented} from "antd-mobile";
import {useTranslation} from "react-i18next";

export default function SegmentedTab() {
  const location = useLocation()
  const navigate = useNavigate()
  const {pathname} = location
  const {t} = useTranslation()

  const changeSegmented = (val: string | number) => {
    navigate(String(val))
  }

  const options = [{label: t('common.todayDate'), value: '/'}, {
    label: t('common.routerSalesData'),
    value: '/data/sale'
  }, {label: t('common.routerDataRetrieval'), value: '/data/retrieval'}]

  return (
    <section className={'containerMain'}>
      <div className={'w-full mb-2 bg-(--bg) sticky top-(--header-height) left-0 z-9'}>
        <Segmented block options={options} value={pathname} onChange={changeSegmented}/>
      </div>
      <Outlet/>
    </section>
  )
}
