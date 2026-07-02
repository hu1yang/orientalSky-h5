import {useEffect, useRef, useState} from "react";
import {
  Button,
  Dialog, FloatingBubble, Form,
  InfiniteScroll, Input,
  List,
  Loading, Popup,
  PullToRefresh,
  SearchBar,
  SwipeAction,
  type SwipeActionRef, Toast
} from "antd-mobile";
import type {ICountries} from "@/types/group.ts";
import {
  addGlobalCountryGroup,
  deleteGlobalCountryGroup,
  getGlobalCountriesGroup,
  updateGlobalCountryGroup
} from "@/utils/request/group.ts";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";
import {result} from "@/utils/public.ts";
import {AddOutline} from "antd-mobile-icons";

export default function BaseNation(){
  const {t} = useTranslation()

  const swiperRef = useRef<SwipeActionRef>(null);
  const [loading, setLoading] = useState(true)
  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)
  const [keyword, setKeyword] = useState('')
  const [searchFormData, setSearchFormData] = useState<{countryCode:string}>({
    countryCode:''
  })
  const [listValue, setListValue] = useState<ICountries[]>([])

  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [nationForm] = Form.useForm()

  const updateNation = (row:ICountries) => {
    nationForm.setFieldsValue({
      id:row.id,
      countryCode:row.countryCode,
      countryName: row.countryName,
      nationality: row.nationality,
    })
    setVisible(true)
  }

  const onNationFormFinish = async (val) => {
    setLoadingBtn(true)
    try{
      let response
      if(val.id){
        response = await updateGlobalCountryGroup(val)
      }else{
        response = await addGlobalCountryGroup(val)
      }
      result(response)
      if(response.succeed){
        resetData()
      }
    } finally {
      setLoadingBtn(false)
      closeVisible()
    }
  }

  const closeVisible = () => {
    setLoadingBtn(false)
    setVisible(false)
    nationForm.resetFields()
  }


  const getData = async (nextPage:number,reset:boolean = false) => {
    try {
      const response = await getGlobalCountriesGroup({pageSize:60,page:nextPage}, searchFormData)
      if(response){
        if(reset){
          setListValue(response)
        }else{
          setListValue(prev => [...prev, ...response])
        }
        setHasMore(response.length === 60)
      }
    } finally {
      setLoading(false)
    }
  }

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const resetData = async () => {
    getData(0,true)
  }

  const searchFilter = (val: string) => {
    if(val.length > 0 && val.length < 2){
      Toast.show({
        content: t('common.twoTips'),
      })
      return
    }
    setSearchFormData({
      countryCode:val
    })
  }

  useEffect(()=>{
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
    getData(0,true)
  },[searchFormData])

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('airport.countryCode')} maxLength={2}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} value={keyword} onChange={setKeyword}
                   onSearch={searchFilter} onClear={() => searchFilter('')}/>
      </div>
      <div className={'p-2'}>
        {
          !loading ?
            <>
              <PullToRefresh onRefresh={resetData}>
                <List  mode={'card'} style={{margin: 0}}>
                  {
                    listValue.map((item: ICountries) => (
                      <SwipeAction
                        key={item.id}
                        ref={swiperRef}
                        closeOnTouchOutside
                        closeOnAction={false}
                        rightActions={
                          [
                            {
                              key: 'edit',
                              text: t('common.edit'),
                              color: 'warning',
                              onClick: () => updateNation(item)
                            },
                            {
                              key: 'delete',
                              text: t('common.delete'),
                              color: 'danger',
                              onClick: async () => {
                                try {
                                  const flag = await Dialog.confirm({
                                    content: t('common.delTips'),
                                  })
                                  if(flag){
                                    const response = await deleteGlobalCountryGroup(item.id as string)
                                    if(response.succeed){
                                      setListValue(prevState =>
                                        prevState.filter(a => a.id !== item.id)
                                      )
                                    }
                                  }
                                } finally {
                                  swiperRef.current?.close()
                                }
                              }
                            }
                          ]
                        }
                      >
                        <List.Item key={item.id} description={item.nationality} title={item.countryCode}
                                   extra={dayjs(item.updatedTime).format('YYYY-MM-DD HH:MM')}>{item.countryName}</List.Item>
                      </SwipeAction>
                    ))
                  }
                </List>
              </PullToRefresh>
              {
                !!listValue.length && (
                  <InfiniteScroll loadMore={loadMore} hasMore={hasMore}/>
                )
              }
            </>
            :
            <Loading />
        }
      </div>
      <Popup visible={visible} destroyOnClose onMaskClick={closeVisible}>
        <Form form={nationForm} mode={'card'} onFinish={onNationFormFinish} footer={
          <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
            {t('common.submit')}
          </Button>
        }>
          <Form.Item hidden name={'id'} />
          <Form.Item label={t('airport.countryCode')} name={'countryCode'} rules={[
            { required: true, message: t('airport.countryCode') },
            { min: 2, max: 2, message: t('common.twoTips') },

          ]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('airport.countryName')} name={'countryName'} rules={[
            { required: true, message: t('airport.countryName') },
          ]}>
            <Input />
          </Form.Item>
          <Form.Item label={t('airport.nationality')} name={'nationality'} rules={[
            { required: true, message: t('airport.nationality') },
          ]}>
            <Input />
          </Form.Item>
        </Form>
      </Popup>
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={() => setVisible(true)}>
        <AddOutline fontSize={22} />
      </FloatingBubble>
    </section>
  )
}
