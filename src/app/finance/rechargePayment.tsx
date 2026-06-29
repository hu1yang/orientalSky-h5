import {useEffect, useRef, useState} from "react";

import dayjs from "dayjs";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectAgentMap} from "@/store/modules/base.ts";

import {
  Button,
  Card,
  Dialog,
  Divider, Form,
  Grid,
  ImageViewer,
  InfiniteScroll,
  Input, Loading,
  Popup, PullToRefresh, Radio, SearchBar,
  Space, Steps,
  Tag, TextArea,
  Toast
} from "antd-mobile";
import {BillOutline, FilterOutline} from "antd-mobile-icons";

import CardText from "@/component/card/cardText.tsx";

import {
  confirmAgentPaymentGroup,
  downloadAgentReceiptGroup, getAgentAccountGroup,
  getAgentPaymentsGroup, getExchangeRateGroup,
  getExchangeRatesGroup, getOperationLogsGroup,
  rejectAgentPaymentGroup, reviewedAgentPaymentGroup
} from "@/utils/request/group.ts";

import type {
  AgentPayment,
  GroupBalance,
  ISearchRechargeForm,
  OrderInfo, RevokeAgentPaymentFormGroup,
} from "@/types/group.ts";
import type {IExchangeRateAgent} from "@/types/agent.ts";
import {result} from "@/utils/public.ts";
import {changedTypeArr} from "@/utils/common.ts";
import NoData from "@/component/default/noData.tsx";
import type {RootState} from "@/store";
import DefaultSelect from "@/component/form/defaultSelect.tsx";
import Log from "@/component/default/log.tsx";

type IAgentPayment = AgentPayment & {
  branchCode: string
  agentCode:string
}
type IUrUserObj = { accountInfo:IAgentPayment,accountPrice:GroupBalance,totalAmount:number }

const statusArr = ['pending', 'reviewed', 'confirmed', 'rejected', 'cancelled']

const { Step } = Steps
export default function FinanceRechargePayment() {
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true)
  const agentMap = useSelector(selectAgentMap)
  const {branchAgents} = useSelector((state: RootState) => state.baseInfo);
  const agentArr = branchAgents.map(b => b?.agents).flat()

  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)

  const [visiblePopSearch, setVisiblePopSearch] = useState(false)
  const [keyword, setKeyword] = useState('')
  const [searchForm] = Form.useForm()
  const [searchFormData, setSearchFormData] = useState<ISearchRechargeForm>({
    transactionId:'',
    id:'',
    bankAccountCode:'',
    status:'',
    unLinked:null,
    minTime: '',
    maxTime: '',
    changedType:'',
    agentId:'',
    branchId:''
  })

  const [listValue, setListValue] = useState<IAgentPayment[]>([])

  const [pictureVisible, setPictureVisible] = useState(false)
  const [pictureList, setPictureList] = useState<string>('')

  const [exchangeRates, setExchangeRates] = useState<IExchangeRateAgent[]>([])

  const [urSurePayVisible, setUrSurePayVisible] = useState<boolean>(false)
  const [urSurePayInfo, setUrSurePayInfo] = useState<IUrUserObj|null>(null)
  const [logList, setLogList] = useState<OrderInfo[]>([])
  const [loadingSubmit, setLoadingSubmit] = useState(false)
  const [urSureForm] = Form.useForm()

  const logRef = useRef<{
    showLog: (logList: OrderInfo[]) => void
  } | null>(null);

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }


  const closeFilter = () => {
    setVisiblePopSearch(false)
  }

  const onSearchFinish = (val: ISearchRechargeForm) => {
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
      transactionId:'',
      id:'',
      bankAccountCode:'',
      status:'',
      unLinked:null,
      minTime: '',
      maxTime: '',
      changedType:'',
      agentId:'',
      branchId:''
    })
    closeFilter()
  }

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      transactionId:val
    }))
  }

  const resetData = async () => {
    pageRef.current = 0
    await getData(0,true)
  }

  const getData = async (nextPage:number,reset:boolean = false) => {
    // setLoading(reset)
    try {
      const response = await getAgentPaymentsGroup({pageSize:20,page:nextPage},searchFormData)
      if(response){
        const value = response.map(item => {
          const info = agentMap.get(item.agentId)

          return {
            ...item,
            branchCode: info?.branchCode,
            agentCode: info?.agentCode
          }
        })
        if(reset){
          setListValue(value)
        }else{
          setListValue(prev => [...prev, ...value])
        }
        setHasMore(response.length === 20)
      }
    } finally {
      setLoading(false)
    }
  }

  const previewFile = async (id:string,type:string) => {
    const response:Blob = await downloadAgentReceiptGroup(id)
    const blobUrl = URL.createObjectURL(response as Blob)

    if(['.jpg','.png','.jpeg'].includes(type)){
      setPictureList(blobUrl)
      setPictureVisible(true)
    }else{
      window.open(blobUrl, '_blank')
    }
  }

  const cancelRechargePayment = (id:string) => {
    let remarks = ''
    Dialog.confirm({
      content: (
        <div className={'w-full flex flex-col justify-start'}>
          <span className={'mb-2 font-bold text-[1.3rem] mb-2'}>{t('common.cancelPaymentTips')}</span>
          <TextArea
            style={{
              '--font-size': '1.2rem'
            }}
            placeholder={t('order.messageShow')}
            onChange={val => {
              remarks = val
            }}
          />
        </div>
      ),
      onConfirm: () => {
        if(!remarks){
          Toast.show({
            content: t('order.messageShow'),
          })
          throw new Error()
        }
        rejectAgentPaymentGroup({id,remarks}).then((res) => {
          result(res)
          if(res.succeed){
            resetData()
          }else{
            throw new Error()
          }
        })
      },
    })
  }

  const reviewPayment = async (row:IAgentPayment) => {
    let remarks = ''
    const agentInfo = await getAgentAccountGroup(row.agentId)
    const exchangeRateInfo = exchangeRates.find(ex => ex.currencyCode === row.currency)
    if(!exchangeRateInfo) return
    const accountInfo = exchangeRates.find(ex => ex.currencyCode === (agentInfo.currency ?? 'USD'))
    Dialog.confirm({
      content: (
        <div className={'w-full flex flex-col justify-start'}>
          <CardText label={t('order.financialTransactionChanges')} value={t('order.'+row.changedType)} valueStyle={'!text-(--warning-color)'} />
          <CardText label={row.changedType === 'income' ? t('group.agentTotalAmount'):t('group.agentPaymentAmount')} value={<><strong>{row.totalAmount.toLocaleString()}</strong>/{row.currency}</>} valueStyle={'!text-(--warning-color)'} />
          <CardText label={t('group.rechargeAgent')} value={row.agentCode} valueStyle={'!text-[1rem] !text-(--text)'} />
          <CardText label={t('foundation.exchangeUpdate')} value={dayjs(exchangeRateInfo?.updatedTime).format('YYYY-MM-DD HH:mm:ss')} />
          <CardText label={<>{t('order.exchangeRate')}({row.currency}/{exchangeRateInfo?.currencyCode})</>} value={exchangeRateInfo?.cashSellingRate} />
          {
            !!accountInfo &&
              <CardText label={t('order.accountRechargeAmount')} value={(Number(
                (Number(row.totalAmount) / (exchangeRateInfo.cashSellingRate / accountInfo.cashSellingRate)).toFixed(4)
              )).toLocaleString()
              } valueStyle={'!text-(--warning-color)'} />
          }
          <Input
            placeholder={t('order.messageShow')}
            onChange={val => {
              remarks = val
            }}
          />
        </div>
      ),
      onConfirm: () => {
        if(!remarks){
          Toast.show({
            content: t('order.messageShow'),
          })
          throw new Error()
        }
        reviewedAgentPaymentGroup({id:row.id,remarks:remarks}).then(res => {
          result(res)
          if(res.succeed){
            resetData()
          }
        })

      },
    })
  }

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
  const getLog = (id:string) => {
    getOperationLogsGroup({page:0,pageSize:40},id).then((res) => {
      setLogList(res)
    })
  }
  const getCurrencyTarget = async (currencyCode:string) => {
    const response = await getExchangeRateGroup(currencyCode)
    return response
  }
  const rechargePrice = async (totalAmount:number,rechargeCurrency:string,accountCurrency:string) => {
    if(rechargeCurrency == accountCurrency) return totalAmount
    const rechargeInfo = await getCurrencyTarget(rechargeCurrency)
    const accountInfo = await getCurrencyTarget(accountCurrency)
    return (totalAmount / (rechargeInfo.cashSellingRate / accountInfo.cashSellingRate))
  }
  const openPaymentSure = (row:IAgentPayment) => {
    setUrSurePayVisible(true)

    getLog(row.id)
    getAgentAccountGroup(row.agentId).then(async (res:GroupBalance) => {
      const totalAmount = await rechargePrice(Number(row.totalAmount),row.currency,res.currency)
      setUrSurePayInfo({
        accountInfo:{...row},
        accountPrice:{...res},
        totalAmount
      })
      urSureForm.setFieldsValue({
        remarks:row.remarks || '',
        totalAmount:totalAmount.toFixed(4)
      })
    })
  }

  const urSureFormFinish = (val: Pick<RevokeAgentPaymentFormGroup, 'transactionId'|'totalAmount'|'remarks'>) => {
    setLoadingSubmit(true)
    const form = {
      ...val,
      agentAccountId: urSurePayInfo?.accountPrice?.id||'',
      agentPaymentId: urSurePayInfo?.accountInfo?.id||'',
    }
    try{
      confirmAgentPaymentGroup(form).then(res => {
        result(res)
        if(res.succeed){
          closeSurePay()
          resetData()
        }
      })

    } finally {
      setLoadingSubmit(false)
    }
  }

  const closeSurePay = () => {
    setUrSurePayVisible(false)
    setLogList([])
    setUrSurePayInfo(null)
    urSureForm.setFieldsValue({
      totalAmount: '',
      remarks:'',
      transactionId:''
    })
  }

  const getExchange = () => {
    getExchangeRatesGroup().then(res => {
      setExchangeRates(res)
    })
  }

  useEffect(() => {
    getExchange()
  }, []);

  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth' // 或 'auto'
    });
    getData(0,true)
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
          !loading? <>
              <PullToRefresh onRefresh={resetData}>
                {
                  listValue.length ? listValue.map((item) => (
                    <Card className={'mb-2'}
                          title={
                            <div className={'flex items-center'}>
                              <BillOutline fontSize={20} color={'var(--warning-color)'} />
                              <span className={'text-[1.1rem] ml-2 font-normal'}>
                          {item.agentCode}
                        </span>
                            </div>
                          }
                          extra={
                            <Tag round color={item.status === 'pending' ? 'warning' : item.status === 'reviewed' ? 'success' : 'primary'}>{t('order.'+item.status)}</Tag>
                          }
                          key={item.id}>
                      <div className={'text-left'}>
                        <div>
                          <div className={'mb-2'}>
                              <span className={'text-[1.6rem] text-(--success-color)'}>
                                {item.totalAmount.toLocaleString()}
                              </span>
                            <span className={'text-(--price-color) text-[1.8rem] ml-2'}>{item.currency}/<span className={'text-[1.2rem]'}>{item.exchangeRate}</span></span>
                          </div>
                          {
                            !!item.agentHistory && (
                              <>
                                <div className={'flex'}>
                                  <div>
                              <span className={'text-[1.4rem] text-(--warning-color)'}>{item.agentHistory.beforeBalance.toLocaleString()}
                                <em className={'text-[1rem] ml-1'}>USD</em>
                              </span>
                                  </div>
                                  <span className={'text-[1rem] ml-3'}>{t('order.beforeBalance')}</span>
                                </div>
                                <div className={'flex'}>
                                  <div>
                              <span className={'text-[1.4rem] text-(--warning-color)'}>{item.agentHistory.currentBalance.toLocaleString()}
                                <em className={'text-[1rem] ml-1'}>USD</em>
                              </span>
                                  </div>
                                  <span className={'text-[1rem] ml-3'}>{t('order.currentBalance')}</span>
                                </div>
                              </>
                            )
                          }
                        </div>
                        <Divider />
                        <div>
                          <CardText label={t('group.company')} value={item.branchCode} valueStyle={'!text-(--warning-color) text-[1.2rem]'} />
                          <CardText label={t('group.transactionId')} value={item.transactionId} />
                          <CardText label={t('group.creationTime')} value={dayjs(item.createdTime).format('YYYY-MM-DD HH:MM')} />
                          <CardText label={t('group.updatedTime')} value={dayjs(item.createdTime).format('YYYY-MM-DD HH:MM')} />
                          <CardText label={t('order.notes')} value={item.remarks} style={'items-start'} valueStyle={'!text-(--warning-color)'} />
                        </div>
                        <Divider contentPosition='left'>{t('order.paymentBank')}</Divider>
                        <div>
                          <CardText value={item.bankAccountName} />
                          <CardText value={item.bankSwiftOrName} />
                          <CardText value={item.bankAccountCode} />
                        </div>
                        {
                          !!(item.agentReceipts && item.agentReceipts.length) && (
                            <>
                              <Divider contentPosition='left'>{t('common.viewRecharge')}</Divider>
                              <Space direction='vertical'>
                                {
                                  item.agentReceipts.map((agentReceipt) => (
                                    <div key={agentReceipt.id} onClick={() => previewFile(agentReceipt.id,agentReceipt.fileType)}>
                                      <span className={'break-all text-(--active-color)'}>{agentReceipt.fileName}</span>
                                    </div>
                                  ))
                                }
                              </Space>
                            </>
                          )
                        }
                        {
                          (item.changedType === 'outlay' || (item.changedType === 'income' && !!item.agentReceipts.length)) && (
                            <>
                              <Divider/>
                              <div className={'flex justify-end'}>
                                <Space justify={'end'}>
                                  <Button shape='rounded' size={'small'} color={'danger'}
                                          onClick={() => cancelRechargePayment(item.id)}>{t('common.rejectRecharge')}</Button>
                                  {
                                    item.status === 'pending' && (
                                      <Button shape='rounded' size={'small'} color={'primary'}
                                              onClick={() => reviewPayment(item)}>{t('common.reviewAgentBalance')}</Button>
                                    )
                                  }
                                  {
                                    item.status === 'reviewed' && (
                                      <Button shape='rounded' size={'small'} color={'success'}
                                              onClick={() => openPaymentSure(item)}>{t('common.surePayment')}</Button>
                                    )
                                  }
                                  <Button shape='rounded' size={'small'} color={'warning'}
                                          onClick={() => getlog(item.id)}>{t('common.routerLog')}</Button>
                                </Space>
                              </div>
                            </>
                          )
                        }
                      </div>
                    </Card>
                  )):<NoData />
                }
              </PullToRefresh>
              {
                !!listValue.length && (
                  <InfiniteScroll loadMore={loadMore} hasMore={hasMore} />
                )
              }
            </>:
            <Loading />
        }
      </div>
      <ImageViewer
        classNames={{
          mask: 'customize-mask',
          body: 'customize-body',
        }}
        image={pictureList}
        visible={pictureVisible}
        onClose={() => {
          setPictureVisible(false)
          setPictureList('')
        }}
      />
      <Popup visible={urSurePayVisible}  onMaskClick={closeSurePay} bodyStyle={{
        borderTopLeftRadius: '8px',
        borderTopRightRadius: '8px',
        height: '90vh',
        backgroundColor: 'var(--bg)',
      }}>
        <div className={'flex flex-col p-4 h-full'}>
          <div className={' flex-1 overflow-scroll'}>
            <Card title={t('common.routerFinance')} className={'mb-2'}>
              <CardText label={t('order.agent')} value={urSurePayInfo?.accountInfo.agentCode} valueStyle={'!text-(--warning-color)'} />
              <CardText label={t('order.financialTransactionChanges')} value={t('order.'+urSurePayInfo?.accountInfo.changedType)} valueStyle={'!text-(--warning-color)'} />
              <Grid columns={3} gap={8} className={'mt-5'}>
                <Grid.Item>
                  <div className={'w-full flex flex-col justify-center items-center bg-(--price-color) py-5 rounded-(--rounder-radius)'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{t('foundation.balance')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.accountPrice.balance.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountPrice.currency}</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={'w-full flex flex-col justify-center items-center bg-(--warning-color) py-5 rounded-(--rounder-radius)'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.agentTotalAmount'):t('group.agentPaymentAmount')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.accountInfo.totalAmount.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountInfo.currency}</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={'w-full flex flex-col justify-center items-center bg-(--success-color) py-5 rounded-(--rounder-radius)'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.actualRechargeAmount'):t('group.actualPaymentAmount')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.totalAmount.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountPrice.currency}</span>
                  </div>
                </Grid.Item>
              </Grid>
            </Card>
            <Card title={t('common.reviewAgentBalance')} className={'mb-2'}>
              <Form layout='horizontal' form={urSureForm} onFinish={urSureFormFinish} style={{
                '--border-top':'0',
                '--border-bottom':'0',
              }}>
                {
                  urSurePayInfo?.accountInfo.changedType === 'outlay' && (
                    <Form.Item label={t('group.transactionId')} name={'transactionId'}>
                      <Input placeholder={t('group.transactionId')} clearable />
                    </Form.Item>
                  )
                }
                <Form.Item label={urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.totalAmount'):t('group.paymentAmount')} name={'totalAmount'}>
                  <Input placeholder={urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.totalAmount'):t('group.paymentAmount')} clearable />
                </Form.Item>
                <Form.Item label={t('order.auditNotes')} name={'remarks'}>
                  <Input placeholder={t('order.auditNotes')} clearable />
                </Form.Item>
              </Form>
            </Card>
            <Card title={t('common.record')} className={'mb-2'}>
              <Steps direction='vertical' className={'scroll-auto'}>
                {
                  logList.map((log,logIndex) => (
                    <Step key={log.id} title={log.message} status={logIndex === 0?'finish':'finish'} description={dayjs(log.time).format('YYYY-MM-DD hh:mm:ss')} />
                  ))
                }
              </Steps>
            </Card>
          </div>
          <Button block color='primary' size='middle' loading={loadingSubmit} onClick={() => urSureForm.submit()}>
            确认充值
          </Button>
        </div>
      </Popup>
      <Popup visible={visiblePopSearch} position='right' onMaskClick={closeFilter}
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
          <Form.Item label={t('foundation.agent')} name={'agentId'}>
            <DefaultSelect options={agentArr.map(item => ({
              label: item.code,
              value: item.id,
            }))} multiple={false} placeholder={t('foundation.agent')} />
          </Form.Item>
          <Form.Item label={t('order.isSure')} name={'unLinked'}>
            <Radio.Group>
              <Space direction='vertical'>
                <Radio value={true}>{t('common.open')}</Radio>
                <Radio value={false}>{t('common.close')}</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('order.status')} name={'status'}>
            <Radio.Group>
              <Space direction='vertical' wrap>
                {
                  statusArr.map((item) => (
                    <Radio key={item} value={item}>{t('order.'+item)}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('order.financialTransactionChanges')} name={'changedType'}>
            <Radio.Group>
              <Space direction='vertical' wrap>
                {
                  changedTypeArr.map((item) => (
                    <Radio key={item} value={item}>{t('order.'+item)}</Radio>
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
