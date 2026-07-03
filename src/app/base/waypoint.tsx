import {type RefObject, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import dayjs from "dayjs";

import {
  Button,
  Card, DatePicker, type DatePickerRef, Dialog,
  Divider, FloatingBubble,
  Form, Grid,
  InfiniteScroll,
  Input,
  Loading,
  Popup,
  PullToRefresh, SearchBar, Selector,
  Space,
  Tag
} from "antd-mobile";
import type {IWayPoints} from "@/types/group.ts";
import {
  addQueryWaypointGroup,
  deleteQueryWaypointGroup,
  getQueryWaypointsGroup,
  updateQueryWaypointGroup
} from "@/utils/request/group.ts";
import CardText from "@/component/card/cardText.tsx";
import {result} from "@/utils/public.ts";
import {AddOutline, FilterOutline} from "antd-mobile-icons";


export default function BaseWaypoints() {
  const {t} = useTranslation()
  const {channel} = useSelector((state: RootState) => state.baseInfo);

  const pageRef = useRef(0);
  const [loading, setLoading] = useState(true)

  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [searchForm] = Form.useForm()
  const [searchFormData, setSearchFormData] = useState({
    iataCode:'',
    channelCode:''
  })
  const [listValue, setListValue] = useState<IWayPoints[]>([])
  const [hasMore, setHasMore] = useState(false)

  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [waypointsForm] = Form.useForm()

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      iataCode:val
    }))
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const onSearchFinish = (val) => {
    setSearchFormData(prevState => ({
      ...prevState,
      ...val,
    }))
    closeFilter()
  }

  const resetSearchFilter = () => {
    searchForm.resetFields()
    setSearchFormData({
      iataCode:'',
      channelCode:''
    })
    closeFilter()
  }


  const closeVisible = () => {
    waypointsForm.resetFields()
    setVisible(false)
    setLoadingBtn(false)
  }

  const onWaypointsFormFinish = async (val) => {
    setLoadingBtn(true)
    try {
      const form = {
        ...val,
        channelCode: val.channelCode[0],
        travelIssuedDate: dayjs(val.travelIssuedDate).format('YYYY-MM-DD'),
        travelExpiryDate: dayjs(val.travelExpiryDate).format('YYYY-MM-DD'),
      }
      let response
      if(val.id){
        response = await updateQueryWaypointGroup(form)
      }else{
        response = await addQueryWaypointGroup(form)
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

  const delWaypoints = (id:string) => {
    Dialog.confirm({
      content: t('common.delTips'),
    }).then(async () => {
      const response = await deleteQueryWaypointGroup(id)
      result(response)
      if(response.succeed){
        setListValue(prevState =>
          prevState.filter(a => a.id !== id)
        )
      }
    })
  }

  const renewInfo = (row: IWayPoints) => {
    waypointsForm.setFieldsValue({
      id:row.id,
      issuedWeeks: row.issuedWeeks,
      channelCode: [row.channelCode],
      iataCode: row.iataCode,
      travelIssuedDate: dayjs(row.travelIssuedDate).toDate(),
      travelExpiryDate: dayjs(row.travelExpiryDate).toDate()
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
      const form = {
        ...searchFormData,
        channelCode:searchFormData.channelCode[0]
      }
      const response = await getQueryWaypointsGroup({pageSize:60,page:nextPage},form)
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
        <SearchBar className={'flex-1'} placeholder={t('airport.cityCode')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}}
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
                {
                  listValue.map((item: IWayPoints) => (
                    <Card className={'mb-2'} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.iataCode}</span>}
                          extra={<Tag round color={'success'}>{item.channelCode}</Tag>}
                          key={item.id}>
                      <div>
                        <CardText label={t('order.travelIssuedDate')} value={item.travelIssuedDate} labelStyle={'w-50!'} />
                        <CardText label={t('order.travelExpiryDate')} value={item.travelExpiryDate} labelStyle={'w-50!'} />
                        <CardText label={t('airport.issuedWeeks')} value={item.issuedWeeks.join(',')} labelStyle={'w-15!'} valueStyle={'text-[1.3rem]'} style={'items-center!'} />
                      </div>
                      <Divider/>
                      <div className={'flex justify-end'}>
                        <Space justify={'end'}>
                          <Button shape='rounded' size={'small'} color='danger' onClick={() => delWaypoints(item.id as string)}>{t('order.delete')}</Button>
                          <Button shape='rounded' size={'small'} color='primary' onClick={() => renewInfo(item)}>{t('group.renew')}</Button>
                        </Space>
                      </div>
                    </Card>
                  ))
                }
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
      <Popup visible={visiblePopSearch} destroyOnClose position='right' onMaskClick={closeFilter}
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
          <Form.Item label={t('base.channelCodes')} name={'channelCode'} rules={[
            { required: true, message: t('base.channelCodes') },
          ]}>
            <Selector columns={4} options={channel.map(item => ({
              label:item.channelName,
              value:item.channelCode,
            }))} />
          </Form.Item>
        </Form>
      </Popup>
      <Popup visible={visible} destroyOnClose onMaskClick={closeVisible}>
        <Form form={waypointsForm} mode={'card'} onFinish={onWaypointsFormFinish} footer={
          <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
            {t('common.submit')}
          </Button>
        }>
          <Form.Item hidden name={'id'} />
          <Form.Item label={t('base.channelCodes')} name={'channelCode'} rules={[
            { required: true, message: t('base.channelCodes') },
          ]}>
            <Selector columns={6} options={channel.map(item => ({
              label:item.channelName,
              value:item.channelCode,
            }))} />
          </Form.Item>
          <Form.Item label={t('airport.cityCode')} name={'iataCode'} rules={[
            { required: true, message: t('airport.cityCode') },
            { min: 3, max: 3, message: t('common.threeTips') },
          ]}>
            <Input min={3} max={3} />
          </Form.Item>
          <Form.Item label={t('airport.issuedWeeks')} name={'issuedWeeks'} rules={[
            { required: true, message: t('airport.issuedWeeks') },
          ]}>
            <Selector
              columns={7}
              multiple
              options={[
                { label: 1, value: 1 },
                { label: 2, value: 2 },
                { label: 3, value: 3 },
                { label: 4, value: 4 },
                { label: 5, value: 5 },
                { label: 6, value: 6 },
                { label: 7, value: 7 },
              ]}
            />
          </Form.Item>
          <Form.Item label={t('airport.travelIssuedDate')} name={'travelIssuedDate'} trigger='onConfirm' rules={[
            { required: true, message: t('airport.travelIssuedDate') },
          ]}
                     onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                       datePickerRef.current?.open()
                     }}>
            <DatePicker>
              {value =>
                value ? dayjs(value).format('YYYY-MM-DD') : t('airport.travelIssuedDate')
              }
            </DatePicker>
          </Form.Item>
          <Form.Item label={t('airport.travelExpiryDate')} name={'travelExpiryDate'} trigger='onConfirm' rules={[
            { required: true, message: t('airport.travelExpiryDate') },
          ]}
                     onClick={(e, datePickerRef: RefObject<DatePickerRef>) => {
                       datePickerRef.current?.open()
                     }}>
            <DatePicker>
              {value =>
                value ? dayjs(value).format('YYYY-MM-DD') : t('airport.travelExpiryDate')
              }
            </DatePicker>
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
