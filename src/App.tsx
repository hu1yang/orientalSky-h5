import {router} from "@/router.tsx";
import {RouterProvider} from "react-router"
import {Provider} from "react-redux";
import {store} from "@/store";
import {ConfigProvider} from "antd-mobile";
import {useTranslation} from "react-i18next";

import zhCN from 'antd-mobile/es/locales/zh-CN'
import enUS from 'antd-mobile/es/locales/en-US'
import ruRU from 'antd-mobile/es/locales/ru-RU'
import {useMemo} from "react";
function App() {
  const {i18n} = useTranslation()
  console.warn(i18n.language)

  const currentLocale = useMemo(() => {
    if(i18n.language === 'en_US'){
      return enUS
    }else if(i18n.language === 'ru_RU'){
      return ruRU
    }else{
      return zhCN
    }
  },[i18n.language])
  return (
    <Provider store={store}>
      <ConfigProvider locale={currentLocale}>
        <RouterProvider router={router}/>
      </ConfigProvider>
    </Provider>
  )
}

export default App
