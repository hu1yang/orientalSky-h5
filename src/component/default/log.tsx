import {useState, forwardRef, useImperativeHandle} from "react";
import dayjs from "dayjs";

import {useTranslation} from "react-i18next";

import {Popup, Steps} from "antd-mobile";
import type {OrderInfo} from "@/types/group.ts";

const { Step } = Steps
export default forwardRef(
  function Log(_,ref){
    const {t} = useTranslation()
    const [visible, setVisible] = useState(false)
    const [logList, setLogList] = useState<OrderInfo[]>([])

    useImperativeHandle(ref,() => {
      return {
        showLog
      }
    })

    const showLog = (logList:OrderInfo[]) => {
      setLogList(logList)
      setVisible(true)
    }

    const closePop = () => {
      setVisible(false)
      setLogList([])
    }

    return (
      <Popup visible={visible} position='right' showCloseButton onClose={closePop} bodyStyle={{width: '100vw'}}>
        <div className={'py-20 px-5 h-full flex flex-col'}>
          <h2>{t('common.routerLog')}</h2>
          <div className={'overflow-auto'}>
            <Steps direction='vertical'>
              {
                logList.map(log => log.isVisible && (
                  <Step key={log.id} title={log.message} description={dayjs(log.time).format('YYYY-MM-DD')} status={'finish'} />
                ))
              }
            </Steps>
          </div>
        </div>
      </Popup>
    )
  }
)
