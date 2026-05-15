import {useEffect, useRef, useState} from "react";

import dayjs from "dayjs";
import {useTranslation} from "react-i18next";

import {
  Button,
  Card,
  Dialog,
  Divider, Form,
  Grid,
  ImageViewer,
  InfiniteScroll,
  Input,
  Popup, PullToRefresh,
  Space, Steps,
  Tag, TextArea,
  Toast
} from "antd-mobile";
import {BillOutline} from "antd-mobile-icons";

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
import {useSelector} from "react-redux";
import {result} from "@/utils/public.ts";
import {selectAgentMap} from "@/store/modules/base.ts";

type IAgentPayment = AgentPayment & {
  branchCode: string
  agentCode:string
}
type IUrUserObj = { accountInfo:IAgentPayment,accountPrice:GroupBalance,totalAmount:number }

const { Step } = Steps
export default function AgentRechargePayment() {
  const {t} = useTranslation()
  const initRef = useRef(false)
  const agentMap = useSelector(selectAgentMap)

  const [hasMore, setHasMore] = useState(false)
  const pageRef = useRef(0)
  const loadingRef = useRef(false)
  const [searchForm, setSearchForm] = useState<ISearchRechargeForm>({
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

  const loadMore = async () => {
    const nextPage = pageRef.current + 1
    pageRef.current = nextPage
    await getData(nextPage)
  }


  const resetData = async () => {
    await getData(0,true)
  }

  const getData = (nextPage:number,reset:boolean = false) => {
    if (loadingRef.current) return
    loadingRef.current = true
    setHasMore(false)
    try {
      getAgentPaymentsGroup({pageSize:20,page:nextPage},searchForm).then((res) => {
        if(res){
          const value = res.map(item => {
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
          setHasMore(res.length === 20)
        }
      })
    } finally {
      loadingRef.current = false
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
      console.log(11)
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

  const reviewPayment = (row:IAgentPayment) => {
    let remarks = ''
    const exchangeRateInfo = exchangeRates.find(ex => ex.currencyCode === row.currency)
    if(!exchangeRateInfo) return
    const accountInfo = exchangeRates.find(ex => ex.currencyCode === 'USD')
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
    if (initRef.current) return
    initRef.current = true
    getExchange()
    getData(pageRef.current,true)
  }, []);
  return (
    <section className={'container'}>
      <div className={'p-2'}>
        <PullToRefresh onRefresh={resetData}>
          {
            listValue.map((item) => (
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
                <div></div>
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
                          </Space>
                        </div>
                      </>
                    )
                  }
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
                  <div className={'w-full flex flex-col justify-center items-center bg-(--price-color) py-5 rounded-[8px]'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{t('foundation.balance')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.accountPrice.balance.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountPrice.currency}</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={'w-full flex flex-col justify-center items-center bg-(--warning-color) py-5 rounded-[8px]'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.agentTotalAmount'):t('group.agentPaymentAmount')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.accountInfo.totalAmount.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountInfo.currency}</span>
                  </div>
                </Grid.Item>
                <Grid.Item>
                  <div className={'w-full flex flex-col justify-center items-center bg-(--success-color) py-5 rounded-[8px]'}>
                    <span className={'text-white text-[1.1rem] mb-2'}>{urSurePayInfo?.accountInfo?.changedType === 'income' ? t('group.actualRechargeAmount'):t('group.actualPaymentAmount')}</span>
                    <span className={'text-white text-[1.6rem] mb-2'}>{urSurePayInfo?.totalAmount.toLocaleString()}</span>
                    <span className={'text-white text-[1.1rem]'}>{urSurePayInfo?.accountPrice.currency}</span>
                  </div>
                </Grid.Item>
              </Grid>
            </Card>
            <Card title={'确认审核'} className={'mb-2'}>
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
            <Card title={'操作记录'} className={'mb-2'}>
              <Steps direction='vertical' className={'scroll-auto'}>
                {
                  logList.map((log,logIndex) => (
                    <Step key={log.id} title={log.message} status={logIndex === 0?'finish':'finish'} description={dayjs(log.time).format('YYYY-MM-DD hh:mm:ss')} />
                  ))
                }
              </Steps>
            </Card>
          </div>
          <Button block color='primary' size='large' loading={loadingSubmit} onClick={() => urSureForm.submit()}>
            确认充值
          </Button>
        </div>
      </Popup>
    </section>
  )
}
