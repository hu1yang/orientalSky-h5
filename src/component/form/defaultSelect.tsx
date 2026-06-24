import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";

import {Button, CheckList, Popup, SearchBar} from "antd-mobile";

type Props = {
  value?: string|string[];
  onChange?: (val: string|string[]) => void
  options: ({
    label: string
    value: string
    description?: string
  })[]
  multiple: boolean
  placeholder?: string
}

export default function DefaultSelect(props: Props) {
  const { value, onChange, options, placeholder, multiple } = props
  const {t} = useTranslation()

  const [visible, setVisible] = useState(false)
  const [selectValue, setSelectValue] = useState<string[]>([])
  const [searchText, setSearchText] = useState('')

  const filteredItems = useMemo(() => {
    if(searchText){
      return options.filter(item => item['label'].includes(searchText.toLocaleUpperCase()))
    }else{
      return options
    }
  },[options,searchText])

  const valueShow = useMemo(() => {
    if(multiple){
      return options.filter(item => value?.includes(item['value']))
    }else{
      return options.filter(item => item['value'] === (value as string))
    }
  }, [options, value])

  const closePop = () => {
    setVisible(false)
    setSearchText('')
    setSelectValue([])
  }

  const chooseSelect = () => {
    if(multiple){
      onChange?.(selectValue)
    }else{
      onChange?.(selectValue[0])
    }
    closePop()
  }

  useEffect(() => {
    const initData = () => {
      if(multiple){
        setSelectValue(value as string[])
      }else{
        setSelectValue([value as string])
      }
    }
    initData()
  },[value,visible])

  return (
    <>
      <div onClick={() => setVisible(true)}>
        {
          (!value || value.length === 0) ?
            <span className={'text-[#eeeeee]'}>{placeholder}</span>:
            valueShow.map((item) => (
              <p key={item['value']}>{item['label']}</p>
            ))
        }
      </div>
      <Popup visible={visible} onMaskClick={closePop} destroyOnClose>
        <div className={'flex justify-between mt-2'}>
          <Button color='primary' size={'mini'} fill='none' onClick={closePop}>
            {t('common.cancel')}
          </Button>
          <Button color='primary' size={'mini'} fill='none' onClick={chooseSelect}>
            {t('common.sure')}
          </Button>
        </div>
        <div className={'px-1 py-4'}>
          <SearchBar
            placeholder={placeholder}
            value={searchText}
            onChange={setSearchText}
          />
        </div>
        <div className={'h-[400px] overflow-y-auto'}>
          <CheckList
            multiple={multiple}
            style={{
              '--border-top': '0',
              '--border-bottom': '0',
            }}
            defaultValue={selectValue}
            onChange={(val) => setSelectValue(val as string[])}
          >
            {filteredItems.map(item => (
              <CheckList.Item key={item['value']} value={item['value']} description={item['description']}>
                {item['label']}
              </CheckList.Item>
            ))}
          </CheckList>
        </div>
      </Popup>
    </>
  )
}
