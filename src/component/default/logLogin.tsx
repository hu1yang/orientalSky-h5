import {useState, forwardRef, useImperativeHandle} from "react";
import dayjs from "dayjs";

import {useTranslation} from "react-i18next";

import {Popup, Steps, Tag} from "antd-mobile";
import type {UserLogInfo} from "@/types/identity.ts";

const { Step } = Steps
export default forwardRef(
  function LogLogin(_,ref){
    const {t} = useTranslation()
    const [visible, setVisible] = useState(false)
    const [logList, setLogList] = useState<UserLogInfo[]>([])

    useImperativeHandle(ref,() => {
      return {
        showLog
      }
    })

    const showLog = (logList:UserLogInfo[]) => {
      setLogList(logList)
      setVisible(true)
    }

    const closePop = () => {
      setVisible(false)
      setLogList([])
    }

    return (
      <Popup visible={visible} destroyOnClose position='right' showCloseButton onClose={closePop} bodyStyle={{width: '100vw'}}>
        <div className={'py-20 px-5 h-full flex flex-col'}>
          <h2>{t('group.loginLog')}</h2>
          <div className={'overflow-auto'}>
            <Steps direction='vertical'>
              {
                logList.map(log => (
                  <Step key={log.id} title={<div>
                    {log.remoteIpAddress}-{t('group.isLogin')}: <Tag color={log.isLoggedin?'success':'danger'}>{t('common.'+log.isLoggedin)}</Tag>
                  </div>} description={dayjs(log.time).format('YYYY-MM-DD')} status={'finish'} />
                ))
              }
            </Steps>
          </div>
        </div>
      </Popup>
    )
  }
)
