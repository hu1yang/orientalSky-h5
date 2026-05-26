import {useMemo, useState} from "react";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {useTranslation} from "react-i18next";

import {CheckList, Popup, SearchBar} from "antd-mobile";
import type {CheckListValue} from "antd-mobile/es/components/check-list";
import {selectAgentMap} from "@/store/modules/base.ts";

type Props = {
  value?: string
  onChange?: (val: string) => void
}

export default function AgentSearch(props: Props){
  const { value, onChange } = props

  const {t} = useTranslation();

  const [visible, setVisible] = useState(false)
  const [searchText, setSearchText] = useState('')

  const agentMap = useSelector(selectAgentMap)
  const {branchAgents} = useSelector((state: RootState) => state.baseInfo);

  const agentArr = branchAgents.map(b => b?.agents).flat()
  const filteredItems = useMemo(() => {
    if(searchText){
      return agentArr.filter(item => item?.code.includes(searchText))
    }else{
      return agentArr
    }
  },[agentArr,searchText])

  return (
    <>
      <div onClick={() => setVisible(true)}>
        {
          !value ?
            <span className={'text-[#eeeeee]'}>{t('common.routerAgent')}</span>:
            <p>{agentMap.get(value || '')?.agentCode}</p>
        }
      </div>
      <Popup visible={visible} onMaskClick={() => setVisible(false)} destroyOnClose>
        <div className={'px-1 py-4'}>
          <SearchBar
            placeholder={t('common.routerAgent')}
            value={searchText}
            onChange={setSearchText}
          />
        </div>
        <div className={'h-[400px] overflow-y-auto'}>
          <CheckList
            style={{
              '--border-top': '0',
              '--border-bottom': '0',
            }}
            value={value ? [value] : []}
            onChange={(val:CheckListValue[]) => {
              const id = val[0] as string
              onChange?.(id)
              setVisible(false)
            }}
          >
            {filteredItems.map(item => (
              <CheckList.Item key={item.id} value={item.id}>
                {item.code}
              </CheckList.Item>
            ))}
          </CheckList>
        </div>
      </Popup>
    </>
  )
}
