import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import type {RootState} from "@/store";
import {useSelector} from "react-redux";
import {selectGroupMap} from "@/store/modules/base.ts";

import type {ExpandsSettingFormGroup, IPayment, IPaymentForm} from "@/types/group.ts";
import {
  addPaymentAccountGroup, deletePaymentAccountGroup,
  getPaymentAccountsGroup,
  updatePaymentAccountGroup,
  updatePaymentExpandsGroup
} from "@/utils/request/group.ts";
import {
  Button,
  Card,
  Dialog,
  Divider, FloatingBubble,
  Form, Grid,
  InfiniteScroll, Input,
  List,
  Loading,
  Popup,
  PullToRefresh,
  Radio, SearchBar,
  Space,
  Tag
} from "antd-mobile";
import CardText from "@/component/card/cardText.tsx";
import ExpandSettingsForm from "@/component/default/expandSettings.tsx";
import type {ExpandsSetting} from "@/types/agent.ts";
import MobileField from "@/component/form/mobileField.tsx";
import {result} from "@/utils/public.ts";
import {AddOutline, FilterOutline} from "antd-mobile-icons";


export default function FoundationPayment (){
  const {t} = useTranslation()
  const {branchAgents} = useSelector((state: RootState) => state.baseInfo);
  const groupMap = useSelector(selectGroupMap)

  const pageRef = useRef(0)

  const [loading, setLoading] = useState(true)
  const [listValue, setListValue] = useState<IPayment[]>([])
  const [hasMore, setHasMore] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [searchForm] = Form.useForm()
  const [searchFormData, setSearchFormData] = useState({
    id: '',
    branchId: '',
    isEnabled: null,
    channelCode: '',
    accountName: ''
  })

  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [paymentForm] = Form.useForm()
  const paymentFormId = Form.useWatch('id',paymentForm)


  const edSettingRef = useRef<{
    addProp:(val: ExpandsSettingFormGroup) => void
  }|null>(null);

  const openSetting = (id:string,form:ExpandsSetting[]) => {
    if(edSettingRef.current){
      edSettingRef.current.addProp({
        id,
        expandSettings:form
      })
    }
  }

  const closePop = () => {
    setVisiblePop(false)
    setLoadingBtn(false)
    paymentForm.resetFields()
  }

  const onFinish = async (val:IPaymentForm) => {
    setLoadingBtn(true)
    try{
      let response
      if(val.id){
        response = await updatePaymentAccountGroup(val)
      }else{
        response = await addPaymentAccountGroup(val)
      }
      result(response)
      if(response.succeed){
        resetData()
        closePop()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const openPayment = (row: IPayment) => {
    setVisiblePop(true)
    paymentForm.setFieldsValue({
      id: row.id,
      branchId: row.branchId,
      lessBalance: row.lessBalance,
      isEnabled: row.isEnabled,
      remarks: row.remarks,
      accountName: row.accountName,
      accountCode: '',
      accountType: row.accountType,
      contactName: row.contactName,
      phoneNumber: row.phoneNumber,
      emailAddress: row.emailAddress
    })
  }

  const delPayment = (id:string) => {
    Dialog.confirm({
      content: t('common.delTips'),
    }).then(async () => {
      const response = await deletePaymentAccountGroup(id)
      result(response)
      if(response.succeed){
        setListValue(prevState =>
          prevState.filter(a => a.id !== id)
        )
      }
    })
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
    setKeyword('')
    setSearchFormData({
      id: '',
      branchId: '',
      isEnabled: null,
      channelCode: '',
      accountName: ''
    })
    closeFilter()
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      accountName:val
    }))
  }

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const getData = async (nextPage:number,reset:boolean = false) => {
    // setLoading(reset)
    try {
      const response = await getPaymentAccountsGroup({pageSize:20,page:nextPage},searchFormData)
      const data = response.map(item => {
        const group = groupMap.get(item.branchId)
        return {
          ...item,
          expandList:[],
          groupCode:group.branchCode
        }
      })
      if(reset){
        setListValue(data)
      }else{
        setListValue(prev => [...prev, ...data])
      }
      setHasMore(response.length === 20)
    } finally {
      setLoading(false)
    }
  }

  const resetData = async () => {
    pageRef.current = 0
    await getData(0,true)
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
    resetData()

  },[searchFormData])

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('order.channelId')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} value={keyword} onChange={setKeyword} onSearch={searchFilter} onClear={() => searchFilter('')} />
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
                  listValue.map((item) => (
                    <Card className={'mb-2'} title={<span
                      className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.accountName}(<span
                      className={'text-red-500'}>{item.groupCode}</span>)</span>}
                          extra={<Tag round
                                      color={!item.isEnabled ? 'danger' : 'success'}> {item?.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>}
                          key={item.id}>
                      <div className={'text-left'}>
                        <div className={'mb-4'}>
                          <CardText label={t('foundation.accountType')}
                                    value={item.accountType}
                                    labelStyle={'!w-30'} valueStyle={'text-right'} />
                          <CardText label={t('base.remarks')}
                                    value={item.remarks || '--'}
                                    labelStyle={'!w-30'} style={'!items-start'} valueStyle={'text-(--text)! text-right'} />
                        </div>
                        <div className={'mb-4'}>
                          <div className={'mb-2 flex justify-between items-center'}>
                            <span className={'text-(--text)'}>{t('group.extensionSettings')}</span>
                            <Button color='primary' size={'mini'} fill='none' onClick={() => openSetting(item.id,item.expandSettings)}>
                              {t('common.edit')}
                            </Button>
                          </div>
                          <div className={'px-2'}>
                            {
                              item.expandSettings.map(expandSetting => (
                                <CardText key={expandSetting.value} label={expandSetting.name} value={expandSetting.value} labelStyle={'text-[1.1rem]!'} style={'items-start'} valueStyle={'text-right text-[1.3rem]!'} />
                              ))
                            }
                          </div>
                        </div>
                        <List header={t('common.routerChannels')} mode={'card'} className={'m-0!'} style={{
                          '--adm-color-background':'#f5f5f5'
                        }}>
                          {
                            item.paymentSettings.map(paymentSetting => (
                              <List.Item key={paymentSetting.channelAccountId} description={paymentSetting.channelAccount.channelCode}>
                                {paymentSetting.channelAccount.accountName}<Tag round className={'ml-2'}
                                                               color={paymentSetting.channelAccount.isEnabled ? 'success' : 'danger'}>{paymentSetting.channelAccount.isEnabled?t('common.open'):t('common.close')}</Tag>
                              </List.Item>
                            ))
                          }
                        </List>
                      </div>
                      <Divider />
                      <div className={'flex justify-end'}>
                        <Space justify={'end'}>
                          <Button shape='rounded' size={'small'} color='danger' onClick={() => delPayment(item.id as string)}>{t('order.delete')}</Button>
                          <Button shape='rounded' size={'small'} color='primary' onClick={() => openPayment(item)}>{t('group.renew')}</Button>
                        </Space>
                      </div>
                    </Card>
                  ))
                }
              </PullToRefresh>
              {
                !!listValue.length && (
                  <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
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
          <Form.Item name={'id'} label={t('order.channelId')}>
            <Input placeholder={t('order.channelId')} />
          </Form.Item>
          <Form.Item name={'accountName'} label={t('order.channelName')}>
            <Input placeholder={t('order.channelName')} />
          </Form.Item>
          <Form.Item name={'branchId'} label={t('group.company')}>
            <Radio.Group>
              <Space direction='horizontal' wrap>
                {
                  branchAgents.map(ba => (
                    <Radio value={ba.branch.id} key={ba.branch.id}>{ba.branch.code}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={'isEnabled'} label={t('order.isEnabled')}>
            <Radio.Group>
              <Space>
                <Radio value={true}>true</Radio>
                <Radio value={false}>false</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Popup>
      <Popup visible={visiblePop} destroyOnClose position='right' showCloseButton onClose={closePop}
             bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
        <div className={'pt-20 pb-10 px-1 h-full flex flex-col'}>
          <div className={'overflow-auto'}>
            <Form form={paymentForm} mode={'card'} onFinish={onFinish} footer={
              <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
                {t('common.submit')}
              </Button>
            }>
              <Form.Item name={'id'} hidden />
              <Form.Item name={'branchId'} label={t('group.company')} rules={[
                {required: true, message: t('group.company')},
              ]}>
                <Radio.Group>
                  <Space direction='horizontal' wrap>
                    {
                      branchAgents.map(ba => (
                        <Radio value={ba.branch.id} key={ba.branch.id}>{ba.branch.code}</Radio>
                      ))
                    }
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'isEnabled'} label={t('order.isEnabled')}>
                <Radio.Group>
                  <Space>
                    <Radio value={true}>true</Radio>
                    <Radio value={false}>false</Radio>
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'accountName'} label={t('order.accountName')}>
                <Input placeholder={t('order.accountName')} />
              </Form.Item>
              <Form.Item name={'accountCode'} label={t('order.accountCode')}>
                <Input placeholder={t('order.accountCode')} type={'password'} />
              </Form.Item>
              <Form.Item name={'accountType'} label={t('foundation.accountType')} disabled={paymentFormId} rules={[
                {required: true, message: t('foundation.accountType')},
              ]}>
                <Radio.Group>
                  <Space direction='horizontal' wrap>
                    {
                      ['payment', 'prepay', 'offline'].map(item => (
                        <Radio value={item} key={item}>{item}</Radio>
                      ))
                    }
                  </Space>
                </Radio.Group>
              </Form.Item>
              <Form.Item name={'lessBalance'} label={t('order.balanceNotificationLimit')}>
                <Input placeholder={t('order.balanceNotificationLimit')} type={'number'} />
              </Form.Item>

              <Form.Item name={'remarks'} label={t('base.remarks')}>
                <Input placeholder={t('base.remarks')} />
              </Form.Item>
              <Form.Item name={'contactName'} label={t('base.contactName')} rules={[
                {required: true, message: t('base.contactName')},
              ]}>
                <Input placeholder={t('base.contactName')} />
              </Form.Item>
              <Form.Item name={'phoneNumber'} label={t('base.phoneNumber')} rules={[
                {required: true, message: t('base.phoneNumber')},
              ]}>
                <MobileField />
              </Form.Item>
              <Form.Item name={'emailAddress'} label={t('base.emailAddress')} rules={[
                {required: true, message: t('base.emailAddress')},
                {required: true, type: 'email' },
              ]}>
                <Input placeholder={t('base.emailAddress')} />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Popup>
      <ExpandSettingsForm ref={edSettingRef} getData={resetData} axiosFnc={updatePaymentExpandsGroup} />
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={() => setVisiblePop(true)}>
        <AddOutline fontSize={22} />
      </FloatingBubble>
    </section>
  )
}
