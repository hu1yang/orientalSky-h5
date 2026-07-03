import {useEffect, useRef, useState} from "react";
import type {RootState} from "@/store";
import {useSelector} from "react-redux";
import {selectAgentMap} from "@/store/modules/base.ts";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {
  Button,
  Card,
  Divider,
  Form, Grid,
  InfiniteScroll, Input,
  Loading, Popup,
  PullToRefresh, Radio,
  SearchBar,
  Space,
  Tag,
  Toast
} from "antd-mobile";
import type {IChannelPayedSettingsSearch, ITopupPaymentsList, OrderInfo} from "@/types/group.ts";
import {getOperationLogsGroup, getTopupPaymentsGroup} from "@/utils/request/group.ts";
import {BillOutline, FilterOutline} from "antd-mobile-icons";
import CardText from "@/component/card/cardText.tsx";
import Log from "@/component/default/log.tsx";
import DefaultSelect from "@/component/form/defaultSelect.tsx";

type ITopupPaymentsListC = ITopupPaymentsList & {
  agentCode: string
}

const statusArr = ['created', 'pending', 'processing', 'finished', 'cancelled']


export default function FinanceRechargePaymentOnline() {
  const {t} = useTranslation();
  const agentMap = useSelector(selectAgentMap)
  const {branchAgents} = useSelector((state: RootState) => state.baseInfo);
  const agentArr = branchAgents.map(b => b?.agents).flat()


  const [loading, setLoading] = useState(true)
  const [listValue, setListValue] = useState<ITopupPaymentsListC[]>([])
  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)

  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchForm] = Form.useForm()
  const [searchFormData, setSearchFormData] = useState<IChannelPayedSettingsSearch>({
    branchId: '',
    id: '',
    agentId: '',
    unLinked: null,
    status: null,
    transactionId: '',
    paymentCode: '',
    reconciled: null,
    minTime: '',
    maxTime: ''
  })

  const onSearchFinish = (val:IChannelPayedSettingsSearch) => {
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
      branchId: '',
      id: '',
      agentId: '',
      unLinked: null,
      status: null,
      transactionId: '',
      paymentCode: '',
      reconciled: null,
      minTime: '',
      maxTime: ''
    })
    closeFilter()
  }

  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      transactionId:val
    }))
  }


  const logRef = useRef<{
    showLog: (logList: OrderInfo[]) => void
  } | null>(null);

  const getlog = (id: string) => {
    getOperationLogsGroup({page:0,pageSize:50},id).then(res => {
      if (res.length) {
        if (logRef) {
          logRef.current?.showLog(res)
        }
      } else {
        Toast.show({
          content: 'No Data',
        })
      }
    })
  }


  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }

  const resetData = async () => {
    pageRef.current = 0
    await getData(0, true)
  }

  const getData = async (nextPage: number, reset: boolean = false) => {
    try {
      const response = await getTopupPaymentsGroup({pageSize: 20, page: nextPage}, searchFormData)
      if (response) {
        const value = response.map(item => {
          const info = agentMap.get(item.agentId)

          return {
            ...item,
            branchCode: info?.branchCode,
            agentCode: info?.agentCode
          }
        })
        if (reset) {
          setListValue(value)
        } else {
          setListValue(prev => [...prev, ...value])
        }
        setHasMore(response.length === 20)
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
    getData(0, true)
  }, [searchFormData]);

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('order.transactionSerialNumber')}
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
                {
                  listValue.map((item) => (
                    <Card className={'mb-2'}
                          title={
                            <div className={'flex items-center'}>
                              <BillOutline fontSize={20} color={'var(--warning-color)'}/>
                              <span className={'text-[1.1rem] ml-2 font-normal'}>
                          {item.agentCode}
                        </span>
                            </div>
                          }
                          extra={
                            <Tag round
                                 color={item.status === 'pending' ? 'warning' : item.status === 'finished' ? 'success' : 'primary'}>{t('group.topupPayment' + item.status)}</Tag>
                          }
                          key={item.id}>
                      <div className={'text-left'}>
                        <div className={'mb-2'}>
                          <CardText label={t('base.paymentAmount')}
                                    value={`${item.paymentAmount.toLocaleString()}${item.currency}`}
                                    labelStyle={'text-[1.1rem]!'}
                                    valueStyle={'!text-(--active-color) text-right! text-[1.3rem]! font-bold'}/>
                          <CardText label={t('base.serviceAmount')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={`${item.serviceAmount.toLocaleString()}${item.currency}`}
                                    valueStyle={'!text-(--warning-color) text-right!'}/>
                          <CardText label={t('base.receivedAmount')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={`${item.receivedAmount.toLocaleString()}${item.currency}`}
                                    valueStyle={'!text-(--price-color) text-right! text-[1.5rem]! font-bold'}/>
                        </div>
                        <Divider
                          style={{
                            borderStyle: 'dashed',
                          }}
                        />
                        {
                          !!item.topupHistory && (
                            <>
                              <div className={'flex'}>
                                <div>
                                    <span
                                      className={'text-[1.4rem] text-(--warning-color)'}>{Number((item.topupHistory?.currentBalance || 0) - (item.topupHistory?.beforeBalance || 0)).toLocaleString()}
                                      <em className={'text-[1rem] ml-1'}>{item.topupHistory?.accountCurrency ?? item.currency}</em>
                                    </span>
                                </div>
                                <span className={'text-[1rem] ml-3'}>{t('order.accountRechargeAmount')}</span>
                              </div>
                              <div className={'flex'}>
                                <div>
                                    <span
                                      className={'text-[1.4rem] text-(--warning-color)'}>{item.topupHistory.beforeBalance.toLocaleString()}
                                      <em className={'text-[1rem] ml-1'}>USD</em>
                                    </span>
                                </div>
                                <span className={'text-[1rem] ml-3'}>{t('order.beforeBalance')}</span>
                              </div>
                              <div className={'flex'}>
                                <div>
                                    <span
                                      className={'text-[1.4rem] text-(--warning-color)'}>{item.topupHistory.currentBalance.toLocaleString()}
                                      <em className={'text-[1rem] ml-1'}>USD</em>
                                    </span>
                                </div>
                                <span className={'text-[1rem] ml-3'}>{t('order.currentBalance')}</span>
                              </div>
                              <Divider
                                style={{
                                  borderStyle: 'dashed',
                                }}
                              />
                            </>
                          )
                        }
                        <div className={'mb-2'}>
                          <CardText label={t('order.exchangeRate')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={item.exchangeRate}
                                    valueStyle={'!text-(--success-color) text-right! text-[1.2rem]!'}/>
                          <CardText label={t('quote.expiredTime')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={dayjs(new Date(item.expiration)).format('YYYY-MM-DD HH:mm')}
                                    valueStyle={'!text-(--text) text-right! text-[1.2rem]!'}/>
                          <CardText label={t('order.hasReconciled')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={<Tag round color={item.reconciled?'success':'danger'}>{t('common.'+item.reconciled)}</Tag>}
                                    valueStyle={'!text-(--text) text-right! text-[1.2rem]!'}/>
                          <CardText label={t('common.routerChannels')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={item.paymentCode}
                                    valueStyle={'!text-(--text) text-right! text-[1.2rem]!'}/>
                          <CardText label={t('order.notes')}
                                    labelStyle={'text-[1.1rem]!'}
                                    value={item.remarks || '-'} style={'items-start'}
                                    valueStyle={'text-(--text)! text-right'}/>
                          <Divider/>
                        </div>
                        <Space justify='end' block className={'w-full text-right'}>
                          <Button color='warning' size='small' onClick={() => getlog(item.id)}>
                            {t('common.routerLog')}
                          </Button>
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
            <Loading/>
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
          <Form.Item label={t('group.rechargeID')} name={'id'}>
            <Input placeholder={t('group.rechargeID')} />
          </Form.Item>
          <Form.Item label={t('group.transactionId')} name={'transactionId'}>
            <Input placeholder={t('group.transactionId')} />
          </Form.Item>
          <Form.Item label={t('foundation.agent')} name={'agentId'}>
            <DefaultSelect options={agentArr.map(item => ({
              label: item.code,
              value: item.id,
            }))} multiple={false} placeholder={t('foundation.agent')} />
          </Form.Item>
          <Form.Item label={t('order.isSure')} name={'unLinked'}
                     getValueProps={(value) => ({
                       value: value !== undefined ? String(value) : undefined
                     })}
                     normalize={(value) => value === 'true'}>
            <Radio.Group>
              <Space direction='vertical'>
                <Radio value="true">{t('common.open')}</Radio>
                <Radio value="false">{t('common.close')}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('order.status')} name={'status'}>
            <Radio.Group>
              <Space direction='vertical' wrap>
                {
                  statusArr.map((item) => (
                    <Radio key={item} value={item}>{t('group.topupPayment' + item)}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
          </Form.Item>
        </Form>
      </Popup>
      <Log ref={logRef} />
    </section>
  )
}
