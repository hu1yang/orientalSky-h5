import {useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";

import {
  Button,
  Dialog, FloatingBubble, Form, Grid,
  InfiniteScroll, Input,
  List,
  Loading,
  Popup,
  PullToRefresh, SearchBar,
  SwipeAction,
  type SwipeActionRef
} from "antd-mobile";
import type {IAddGlobalAirportsForm, IGetGlobalAirports, IGetGlobalAirportsForm} from "@/types/group.ts";
import {
  addGlobalAirportGroup,
  deleteGlobalAirportGroup,
  getGlobalAirportsGroup,
  updateGlobalAirportGroup
} from "@/utils/request/group.ts";
import {AddOutline, FilterOutline} from "antd-mobile-icons";
import {result} from "@/utils/public.ts";

export default function BaseAirport() {
  const {t,i18n} = useTranslation()

  const lagname = useMemo(() => {
    if(i18n.language === 'zh_CN'){
      return 'CName'
    }
    return 'EName'
  },[i18n.language])

  const swiperRef = useRef<SwipeActionRef>(null);
  const [visiblePopSearch, setVisiblePopSearch] = useState(false)

  const [keyword, setKeyword] = useState('')
  const [searchForm] = Form.useForm()

  const [loading, setLoading] = useState(true)
  const [searchFormData, setSearchFormData] = useState<IGetGlobalAirportsForm>({
    countryCode:'',
    cityCode:'',
    airportCode:''
  })
  const pageRef = useRef(0)
  const [hasMore, setHasMore] = useState(false)
  const [listValue, setListValue] = useState<IGetGlobalAirports[]>([])

  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [airportForm] = Form.useForm()

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      airportCode:val
    }))
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const onSearchFinish = (val: IGetGlobalAirportsForm) => {
    setSearchFormData(prevState => ({
      ...prevState,
      ...val,
    }))
    closeFilter()
  }

  const resetSearchFilter = () => {
    searchForm.resetFields()
    setKeyword('')
    setSearchFormData({
      countryCode:'',
      cityCode:'',
      airportCode:''
    })
    closeFilter()
  }

  const closeVisible = () => {
    setVisible(false)
    setLoadingBtn(false)
    airportForm.resetFields()
  }

  const onAirportFormFinish = async (val: IAddGlobalAirportsForm) => {
    setLoadingBtn(true)
    try {
      let response
      if(val.id){
        response = await updateGlobalAirportGroup(val)
      }else{
        response = await addGlobalAirportGroup(val)
      }
      result(response)
      if(response.succeed){
        closeVisible()
        resetData()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const updateAirport = (row:IGetGlobalAirports) => {
    airportForm.setFieldsValue({
      countryEName:row.countryEName,
      countryCName:row.countryCName,
      cityEName:row.cityEName,
      cityCName:row.cityCName,
      airportEName:row.airportEName,
      airportCName:row.airportCName,
      id:row.id,
      countryCode:row.countryCode,
      cityCode:row.cityCode,
      airportCode:row.airportCode,
      timeZone:row.timeZone,
    })
    setVisible(true)
  }

  const resetData = async () => {
    getData(0,true)
  }

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const getData = async (nextPage:number,reset:boolean = false) => {
    try {
      const response = await getGlobalAirportsGroup({pageSize:60,page:nextPage},searchFormData)
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

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
    getData(0,true)
  },[searchFormData])

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('airport.airportCode')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} value={keyword} onChange={setKeyword}
                   onSearch={searchFilter} onClear={() => searchFilter('')}/>
        <Button fill='none' className={'!ml-2'} onClick={() => setVisiblePopSearch(true)}>
          <FilterOutline fontSize={18} color={'var(--active-color)'} />
        </Button>
      </div>
      <div className={'p-2'}>
        {
          !loading ?
            <>
              <PullToRefresh onRefresh={resetData}>
                <List mode={'card'} style={{margin: 0}}>
                  {
                    listValue.map((item: IGetGlobalAirports) => (
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
                              onClick: () => updateAirport(item)
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
                                    const response = await deleteGlobalAirportGroup(item.id as string)
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
                        <List.Item key={item.id} title={`${item[('country'+lagname) as keyof IGetGlobalAirports]}(${item.countryCode})`} description={`${item[('city'+lagname) as keyof IGetGlobalAirports]}(${item.cityCode})`} extra={`${t('airport.timeZone')}${item.timeZone}`}>{item.airportCode}-{item[('airport'+lagname) as keyof IGetGlobalAirports]}</List.Item>
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
      <Popup visible={visiblePopSearch} position='right' destroyOnClose onMaskClick={closeFilter}
             bodyStyle={{width: '80vw', backgroundColor: 'var(--bg)'}}>
        <Form form={searchForm} mode={'card'} onFinish={onSearchFinish} footer={
          <Grid columns={2} gap={8}>
            <Grid.Item>
              <Button block size='small' onClick={resetSearchFilter}>
                {t('group.reset')}
              </Button>
            </Grid.Item>
            <Grid.Item>
              <Button block type='submit' color='primary' size='small'>
                {t('common.search')}
              </Button>
            </Grid.Item>
          </Grid>
        }>
          <Form.Item label={t('airport.countryCode')} name={'countryCode'} rules={[
            { min: 2, max: 2, message: t('common.twoTips') },
          ]}>
            <Input min={2} max={2} />
          </Form.Item>
          <Form.Item label={t('airport.cityCode')} name={'cityCode'} rules={[
            { min: 3, max: 3, message: t('common.threeTips') },
          ]}>
            <Input min={3} max={3} />
          </Form.Item>
        </Form>
      </Popup>
      <Popup visible={visible} position='right' destroyOnClose showCloseButton onClose={closeVisible} bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
        <div className={'pt-20 pb-10 px-1 h-full flex flex-col'}>
          <div className={'overflow-auto'}>
            <Form form={airportForm} mode={'card'} onFinish={onAirportFormFinish} footer={
              <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
                {t('common.submit')}
              </Button>
            }>
              <Form.Item hidden name={'id'} />
              <Form.Item label={t('airport.countryCode')} name={'countryCode'} rules={[
                { required: true, message: t('airport.countryCode') },
                { min: 2, max: 2, message: t('common.twoTips') },
              ]}>
                <Input min={2} max={2} />
              </Form.Item>
              <Form.Item label={`${t('airport.countryName')} EN`} name={'countryEName'}>
                <Input />
              </Form.Item>
              <Form.Item label={`${t('airport.countryName')} CN`} name={'countryCName'}>
                <Input />
              </Form.Item>
              <Form.Item label={`${t('airport.cityName')} EN`} name={'cityEName'}>
                <Input />
              </Form.Item>
              <Form.Item label={`${t('airport.cityName')} CN`} name={'cityCName'}>
                <Input />
              </Form.Item>
              <Form.Item label={t('airport.cityCode')} name={'cityCode'} rules={[
                { required: true, message: t('airport.cityCode') },
                { min: 3, max: 3, message: t('common.threeTips') },
              ]}>
                <Input min={3} max={3} />
              </Form.Item>
              <Form.Item label={`${t('airport.airportName')} EN`} name={'airportEName'}>
                <Input />
              </Form.Item>
              <Form.Item label={`${t('airport.airportName')} CN`} name={'airportCName'}>
                <Input />
              </Form.Item>
              <Form.Item label={t('airport.airportCode')} name={'airportCode'} rules={[
                { required: true, message: t('airport.cityCode') },
                { min: 3, max: 3, message: t('common.threeTips') },
              ]}>
                <Input min={3} max={3} />
              </Form.Item>
              <Form.Item label={t('airport.timeZone')} name={'timeZone'} rules={[
                { required: true, message: t('airport.timeZone') },
                { validator: (_, value: string) => {
                    const num = Number(value)
                    if (isNaN(num)) {
                      return Promise.reject(new Error(t('airport.isNumber')))
                    } else if (num < -1440 || num > 1440) {
                      return Promise.reject(new Error(t('airport.is_1440')))
                    } else {
                      return Promise.resolve()
                    }
                  }
                }
              ]}>
                <Input type={'number'} />
              </Form.Item>
            </Form>
          </div>
        </div>
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
