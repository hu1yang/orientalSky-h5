import {Outlet, useLocation, useNavigate} from "react-router";

import {Segmented} from "antd-mobile";

export default function SegmentedTab(){
  const location = useLocation()
  const navigate = useNavigate()
  const {pathname} = location

  const changeSegmented = (val:string|number) => {
    navigate(String(val))
  }

  return (
    <section className={'containerMain'}>
      <div className={'w-full mb-5 bg-(--bg)'}>
        <Segmented block options={[{label:'当日数据',value:'/'}, {label:'销售数据',value:'/data/sale'}, {label:'查定数据',value:'/data/retrieval'}]} value={pathname} onChange={changeSegmented} />
      </div>
      <Outlet />
    </section>
  )
}
