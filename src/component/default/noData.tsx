import {ErrorBlock} from "antd-mobile";

export default function NoData(){
  return (
    <ErrorBlock
      image={
        <img className={'inline-block'} src="https://gw.alipayobjects.com/zos/antfincdn/ZHrcdLPrvN/empty.svg" alt=""/>
      }
      status={'empty'}
      style={{
        '--image-height': '150px',
      }} />
  )
}
