import {useEffect, useRef, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";
import {selectGroupMap} from "@/store/modules/base.ts";

import {
  Button,
  Card, Checkbox,
  Dialog,
  Divider, Form, Grid,
  InfiniteScroll, Input,
  Loading, Popup,
  PullToRefresh,
  Radio,
  SearchBar, Selector,
  Space, Switch,
  Tag, TextArea
} from "antd-mobile";

import CardText from "@/component/card/cardText.tsx";
import {
  addChannelSettingsGroup, deleteChannelSettingsGroup,
  getChannelAccountsGroup,
  resetChannelHistoryGroup, updateAccountExpandsGroup,
  updateChannelSettingsGroup
} from "@/utils/request/group.ts";

import type {ExpandsSettingFormGroup, IBooking, IChannelAccount, ISearchBooking} from "@/types/group.ts";
import {result} from "@/utils/public.ts";
import MobileField from "@/component/form/mobileField.tsx";
import {FilterOutline} from "antd-mobile-icons";
import type {ExpandsSetting} from "@/types/agent.ts";
import ExpandSettingsForm from "@/component/default/expandSettings.tsx";

type IBookingC = IBooking & {
  groupCodeInfo: string;
  groupCodeInfos: string[];
}

export default function FoundationBooking() {
  const {t} = useTranslation()
  const {id} = useParams()

  const {channel,branchMore,branchAgents} = useSelector((state: RootState) => state.baseInfo);
  const groupMap = useSelector(selectGroupMap)

  const [hasMore, setHasMore] = useState(false)
  const [loading, setLoading] = useState(true)

  const pageRef = useRef(0)

  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [keyword, setKeyword] = useState(id || '')
  const [searchFormData, setSearchFormData] = useState<ISearchBooking>({
    id: id || '',
    branchId: '',
    isEnabled: null,
    channelCode: '',
    accountName: '',
    groupCode:''
  })

  const [listValue, setListValue] = useState<IBookingC[]>([])

  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [form] = Form.useForm()
  const [searchForm] = Form.useForm()


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

  const delChannel = (id: string) => {
    Dialog.confirm({
      content: t('common.deleteConfirm'),
      onConfirm: async () => {
        try{
          const response = await deleteChannelSettingsGroup(id)
          result(response)
          if(response.succeed){
            resetData()
          }
        } catch {
          throw new Error()
        }
      },
    })
  }

  const closePop = () => {
    setVisiblePop(false)
    form.resetFields()
  }

  const openChannel = (row: IBooking) => {
    form.setFieldsValue({
      id: row.id,
      branchId: row.branchId,
      branchIds: row.branchIds,
      isEnabled: row.isEnabled,
      groupCode:row.groupCode,
      accountName: row.accountName,
      accountCode: '',
      channelCode: row.channelCode,
      scaleLimited: row.scaleLimited,
      queryLimited: row.queryLimited,
      remarks: row.remarks,
      contactName: row.contactName,
      phoneNumber: row.phoneNumber,
      emailAddress: row.emailAddress,
      scaleLimitedDaysLength: row.scaleLimitedDaysLength,
      orderRangeAmount:row.orderRangeAmount,
      payedRangeAmount:row.payedRangeAmount,
      voidedFeesAmount:row.voidedFeesAmount,
      refundFeesAmount:row.refundFeesAmount,
      changeFeesAmount:row.changeFeesAmount,
      appendFeesAmount:row.appendFeesAmount,
    })
    setVisiblePop(true)
  }

  const onFinish = async (val:IChannelAccount) => {
    const id = val.id
    setLoadingBtn(true)
    try{
      let response
      if (id) {
        response = await updateChannelSettingsGroup({
          id,...val
        })
      }else{
        response = await addChannelSettingsGroup(val)
      }
      result(response)
      if(response.succeed){
        setVisiblePop(false)
        resetData()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const resetHistory = (id: string) => {
    Dialog.confirm({
      content: t('quote.resetVerificationHistorytips'),
      onConfirm: async () => {
        try{
          const response = await resetChannelHistoryGroup(id)
          result(response)
          if(response.succeed){
            resetData()
          }
        } catch {
          throw new Error()
        }
      },
    })
  }

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const resetData = async () => {
    pageRef.current = 0
    await getData(0,true)
  }

  const getData = async (nextPage:number,reset:boolean = false) => {
    // setLoading(reset)
    try {
      const response = await getChannelAccountsGroup({pageSize:20,page:nextPage},searchFormData)
      const data = response.map(item => {
        const group = groupMap.get(item.branchId)
        const groupCodes = item.branchIds.map(bd => {
          const gr = groupMap.get(bd)
          if(gr){
            return gr.branchCode
          }
        })
        return {
          ...item,
          groupCodeInfo: group.branchCode,
          groupCodeInfos: groupCodes
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

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      id:val
    }))
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }
  const onSearchFinish = (val: ISearchBooking) => {
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
        accountName: '',
        groupCode:''
    })
    closeFilter()
  }

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
    resetData()
  }, [searchFormData]);

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
          !loading ? <>
              <PullToRefresh onRefresh={resetData}>
                {
                  listValue.map((item) => (
                    <Card className={'mb-2'} title={<span
                      className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.channelCode}(<span
                      className={'text-red-500'}>{item.groupCodeInfo}</span>)</span>}
                          extra={<Tag round
                                      color={!item.isEnabled ? 'danger' : 'success'}> {item?.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>}
                          key={item.id}>
                      <div className={'text-left'}>
                        <h4 className={'text-black font-bold text-[1.3rem] my-4'}>{t('base.baseInfo')}</h4>
                        <CardText label={t('group.applicableCompanies')} value={item.groupCodeInfos.join(',') || '--'} valueStyle={'text-(--success-color)! text-[1.3rem]!'} />
                        <CardText label={t('base.groupCode')} value={item.groupCode} valueStyle={'text-(--active-color)! text-[1.3rem]!'} />
                        <CardText label={t('order.accountName')} value={item.accountName}/>
                        <CardText label={t('order.scaleSetting')} value={item.scaleLimited}/>
                        <CardText label={t('order.queryLimited')} value={item.queryLimited}/>
                        <CardText label={t('order.scaleLimitedDaysLength')} value={item.scaleLimitedDaysLength}/>
                        <CardText label={t('order.notes')} value={item.remarks} valueStyle={'line-clamp-3'}/>
                      </div>
                      <Divider style={{
                        borderStyle: 'dashed',
                      }}/>
                      <Grid columns={2} gap={8}>
                        <Grid.Item>{t('base.voidedFeesAmount')}: {item.voidedFeesAmount} USD</Grid.Item>
                        <Grid.Item>{t('base.refundFeesAmount')}: {item.refundFeesAmount} USD</Grid.Item>
                        <Grid.Item>{t('base.changeFeesAmount')}: {item.changeFeesAmount} USD</Grid.Item>
                        <Grid.Item>{t('base.appendFeesAmount')}: {item.appendFeesAmount} USD</Grid.Item>
                      </Grid>
                      <Divider style={{
                        borderStyle: 'dashed',
                      }}/>
                      <Grid columns={2} gap={8}>
                        <Grid.Item>{t('base.defaultPurchaseRange')}: {item.orderRangeAmount} USD</Grid.Item>
                        <Grid.Item>{t('base.defaultPaymentRange')}: {item.payedRangeAmount} USD</Grid.Item>
                      </Grid>
                      <Divider style={{
                        borderStyle: 'dashed',
                      }}/>
                      <div className={'mb-4'}>
                        <div className={'mb-2 flex justify-between items-center'}>
                          <span className={'text-(--text)'}>{t('group.extensionSettings')}</span>
                          <Button color='primary' size={'mini'} fill='none' onClick={() => openSetting(item.id!,item.expandSettings)}>
                            {t('common.edit')}
                          </Button>
                        </div>
                        <div className={'px-2'}>
                          {
                            item.expandSettings.map(expandSetting => (
                              <CardText key={expandSetting.value} label={expandSetting.name} style={'items-start'} value={expandSetting.value} labelStyle={'text-[1.1rem]! w-50!'} valueStyle={'text-right text-[1.3rem]!'} />
                            ))
                          }
                        </div>
                      </div>
                      <Divider/>
                      <div className={'flex justify-end'}>
                        <Space justify={'end'}>
                          <Button shape='rounded' size={'small'} color='danger' onClick={() => delChannel(item.id as string)}>{t('order.delete')}</Button>
                          <Button shape='rounded' size={'small'} color='primary' onClick={() => openChannel(item)}>{t('group.renew')}</Button>
                          <Button shape='rounded' size={'small'} color='warning' onClick={() => resetHistory(item.id as string)}>{t('quote.resetVerificationHistory')}</Button>
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
          <Form.Item name={'branchId'} label={t('group.company')}>
            <Radio.Group>
              <Space direction='horizontal' wrap>
                {
                  branchMore.map(branch => (
                    <Radio value={branch.id} key={branch.id}>{branch.code}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={'channelCode'} label={t('order.channelCode')}>
            <Radio.Group>
              <Space direction='horizontal' wrap>
                {
                  channel.map(branch => (
                    <Radio value={branch.channelCode} key={branch.channelCode}>{branch.channelName}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item name={'groupCode'} label={t('base.groupCode')}>
            <Input placeholder={t('base.groupCode')} />
          </Form.Item>
          <Form.Item name={'isEnabled'} label={t('order.isEnabled')}>
            <Switch defaultChecked />
          </Form.Item>
        </Form>
      </Popup>
      <Popup visible={visiblePop} destroyOnClose position='right' showCloseButton onClose={closePop}
             bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
        <div className={'pt-20 pb-10 px-1 h-full flex flex-col'}>
          <div className={'overflow-auto'}>
            <Form form={form} mode={'card'} onFinish={onFinish} footer={
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
              <Form.Item name={'branchIds'} label={t('group.applicableCompanies')}>
                <Checkbox.Group>
                  <Space direction='horizontal' wrap>
                    {
                      branchAgents.map(ba => (
                        <Checkbox value={ba.branch.id} key={ba.branch.id}>{ba.branch.code}</Checkbox>
                      ))
                    }
                  </Space>
                </Checkbox.Group>
              </Form.Item>
              <Form.Item name={'isEnabled'} label={t('order.isEnabled')}>
                <Switch defaultChecked />
              </Form.Item>
              <Form.Item name={'groupCode'} label={t('base.groupCode')} rules={[
                {required: true, message: t('base.groupCode')},
              ]}>
                <Input placeholder={t('base.groupCode')} />
              </Form.Item>
              <Form.Item name={'accountName'} label={t('order.accountName')}>
                <Input placeholder={t('order.accountName')} />
              </Form.Item>
              <Form.Item name={'accountCode'} label={t('order.accountCode')}>
                <Input placeholder={t('order.accountCode')} type={'password'} />
              </Form.Item>
              <Form.Item name={'channelCode'} label={t('order.channelCode')} rules={[
                {required: true, message: t('order.channelCode')},
              ]}>
                <Selector options={channel} multiple fieldNames={{label:'channelName',value:'channelCode'}} />
              </Form.Item>
              <Form.Item name={'orderRangeAmount'} label={t('base.defaultPurchaseRange')}>
                <Input placeholder={t('base.defaultPurchaseRange')} type={'number'} min={1} />
              </Form.Item>
              <Form.Item name={'payedRangeAmount'} label={t('base.defaultPaymentRange')}>
                <Input placeholder={t('base.defaultPaymentRange')} type={'number'} min={1} />
              </Form.Item>

              <Form.Item name={'voidedFeesAmount'} label={t('base.voidedFeesAmount')} rules={[
                {required: true, message: t('base.voidedFeesAmount')},
              ]}>
                <Input placeholder={t('base.voidedFeesAmount')} type={'number'} min={1} />
              </Form.Item>
              <Form.Item name={'refundFeesAmount'} label={t('base.refundFeesAmount')} rules={[
                {required: true, message: t('base.refundFeesAmount')},
              ]}>
                <Input placeholder={t('base.refundFeesAmount')} type={'number'} min={1} />
              </Form.Item>
              <Form.Item name={'changeFeesAmount'} label={t('base.changeFeesAmount')} rules={[
                {required: true, message: t('base.changeFeesAmount')},
              ]}>
                <Input placeholder={t('base.changeFeesAmount')} type={'number'} min={1} />
              </Form.Item>
              <Form.Item name={'appendFeesAmount'} label={t('base.appendFeesAmount')} rules={[
                {required: true, message: t('base.appendFeesAmount')},
              ]}>
                <Input placeholder={t('base.appendFeesAmount')} type={'number'} min={1} />
              </Form.Item>

              <Form.Item name={'scaleLimited'} label={t('order.scaleSetting')} rules={[
                {required: true, message: t('order.scaleSetting')},
              ]}>
                <Input placeholder={t('order.scaleSetting')} type={'number'} min={1} />
              </Form.Item>
              <Form.Item name={'queryLimited'} label={t('order.queryLimited')} rules={[
                {required: true, message: t('order.queryLimited')},
              ]}>
                <Input placeholder={t('order.queryLimited')} type={'number'} max={-1} />
              </Form.Item>
              <Form.Item name={'scaleLimitedDaysLength'} label={t('order.scaleLimitedDaysLength')} rules={[
                {required: true, message: t('order.scaleLimitedDaysLength')},
              ]}>
                <Input placeholder={t('order.scaleLimitedDaysLength')} type={'number'} min={1} />
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
                { type: 'email', warningOnly: true },
              ]}>
                <Input placeholder={t('base.emailAddress')} />
              </Form.Item>
              <Form.Item name={'remarks'} label={t('base.remarks')}>
                <TextArea
                  placeholder={t('base.remarks')}
                  maxLength={100}
                  rows={2}
                  showCount
                />
              </Form.Item>
            </Form>
          </div>
        </div>
      </Popup>
      <ExpandSettingsForm ref={edSettingRef} getData={resetData} axiosFnc={updateAccountExpandsGroup} />
    </section>
  )
}
