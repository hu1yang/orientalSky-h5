import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectGroupMap} from "@/store/modules/base.ts";
import {
  Button,
  Card,
  Dialog,
  Divider,
  FloatingBubble,
  Form,
  Input,
  List,
  Loading,
  Popup,
  PullToRefresh, SearchBar,
  Space,
  Tag
} from "antd-mobile";
import type {IChannelSettingsBalance, IExchangeRate, IPaymentAccount} from "@/types/group.ts";
import {
  addChannelBalanceGroup,
  deleteChannelBalanceGroup, findBalanceAccountsGroup,
  getChannelBalancesGroup,
  getExchangeRatesGroup, updateChannelBalanceGroup, upsertBalanceSettingsGroup
} from "@/utils/request/group.ts";
import CardText from "@/component/card/cardText.tsx";
import {result} from "@/utils/public.ts";
import {AddOutline} from "antd-mobile-icons";
import DefaultSelect from "@/component/form/defaultSelect.tsx";


export default function ChannelBalance() {
  const {t} = useTranslation()

  const [keyword, setKeyword] = useState('')

  const [loading, setLoading] = useState(true)
  const [channelList, setChannelList] = useState<IChannelSettingsBalance[]>([])
  const groupMap = useSelector(selectGroupMap)

  const [exchangeRates, setExchangeRates] = useState<IExchangeRate[]>([])
  const [balanceAccountList, setBalanceAccountList] = useState<IPaymentAccount[]>([])

  const [balanceVisible, setBalanceVisible] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [formType, setFormType] = useState<'detail'|'payment'>('detail')
  const [balanceForm] = Form.useForm()

  const getExchange = () => {
    if(!exchangeRates.length){
      getExchangeRatesGroup().then(res => {
        setExchangeRates(res)
      })
    }
  }

  const balanceAccounts = async () => {
    const response = await findBalanceAccountsGroup({
      accountName:'',
      isEnabled:true,
      accountType:'payment'
    })
    setBalanceAccountList(response)
  }

  const addBalance = (item?:null|IChannelSettingsBalance) => {
    setFormType('detail')
    getExchange()
    setBalanceVisible(true)
    if(item){
      balanceForm.setFieldsValue({
        id: item.id,
        totalBalance: item.totalBalance,
        lessBalance: item.lessBalance,
        groupName: item.groupName,
        currency: item.currency
      })
    }
  }

  const addPayment = (item:IChannelSettingsBalance) => {
    setFormType('payment')
    setBalanceVisible(true)
    balanceAccounts()
    balanceForm.setFieldsValue({
      balanceId: item.id,
      accountIds: item.balanceSettings.map(balanceSetting => balanceSetting.paymentAccountId),
    })
  }

  const closeCompanyVisible = () => {
    setBalanceVisible(false)
    setButtonLoading(false)
    setFormType('detail')
    balanceForm.resetFields()
  }

  const finishForm = async (val) => {
    setButtonLoading(true)

    try {
      let response
      if(formType === 'detail'){
        const form = {
          ...val,
          id: balanceForm.getFieldValue('id') || ''
        }
        if(form.id){
          response = await updateChannelBalanceGroup(form)
        }else{
          response = await addChannelBalanceGroup(form)
        }
      }else{
        const form = {
          ...val,
          balanceId: balanceForm.getFieldValue('balanceId') || ''
        }
        response = await upsertBalanceSettingsGroup(form)
      }

      result(response)
      if(response.succeed){
        setBalanceVisible(false)
        getData()
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const delData = (id:string) => {
    Dialog.confirm({
      content: t('common.deleteConfirm'),
      onConfirm: async () => {
        try{
          const response = await deleteChannelBalanceGroup(id)
          result(response)
          if(response.succeed){
            getData()
          }
        } catch {
          throw new Error()
        }
      },
    })
  }

  const getData = async () => {
    try {
      const response = await getChannelBalancesGroup()
      setChannelList(response)
    } finally {
      setLoading(false)
    }
  }

  const channelListMemo = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();

    return channelList.filter(item => {
      return item.groupName ? item.groupName.toLowerCase().includes(lowerKeyword) : false;
    });
  }, [keyword, channelList]);

  useEffect(() => {
    getData()
  },[])

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('order.channelName')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} onSearch={setKeyword} onClear={() => setKeyword('')} />
      </div>
      <div className="p-2">
        {
          !loading?
            <PullToRefresh onRefresh={getData}>
              {
                channelListMemo.map((item) => (
                  <Card className={'mb-2'} key={item.id} style={{'--adm-card-border-radius': 'var(--rounder-radius)'}}
                        title={<span
                          className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.groupName}</span>}>
                    <CardText label={t('foundation.totalBalance')} value={`${item.totalBalance} ${item.currency}`} labelStyle={'!w-20'} />
                    <CardText label={t('foundation.lessBalance')} value={`${item.lessBalance} ${item.currency}`} labelStyle={'!w-20'} />
                    <List header={t('group.basicConfiguration')} mode={'card'} className={'m-0!'} style={{
                      '--adm-color-background':'#f5f5f5'
                    }}>
                      {
                        item.balanceSettings.map(balanceSetting => (
                          <List.Item key={balanceSetting.paymentAccountId} extra={balanceSetting.paymentAccount.accountType} title={
                            groupMap.get(balanceSetting.paymentAccount.branchId)?.branchCode || ''
                          } description={`${balanceSetting.paymentAccount.remarks}`}>
                            {balanceSetting.paymentAccount.accountName}<Tag className={'ml-2'} round color={balanceSetting.paymentAccount.isEnabled?'success':'danger'}>{balanceSetting.paymentAccount.isEnabled?t('common.open'):t('common.close')}</Tag>
                          </List.Item>
                        ))
                      }
                    </List>
                    <Divider />
                    <Space justify={'end'} className={'w-full'}>
                      <Button size={'small'} color={'danger'} onClick={() => delData(item.id)}>{t('common.delete')}</Button>
                      <Button size={'small'} color={'warning'} onClick={() => addBalance(item)}>{t('group.renew')}</Button>
                      <Button size={'small'} color={'warning'} onClick={() => addPayment(item)}>{t('group.basicConfiguration')}</Button>
                    </Space>
                  </Card>
                ))
              }
            </PullToRefresh>
            :
            <Loading />
        }
      </div>
      <Popup visible={balanceVisible} destroyOnClose position='bottom' onMaskClick={closeCompanyVisible}>
        <div className={'p-3 my-2 text-center'}>
          <span className={'text-[1.4rem] mb-20'}>{
            t('common.routerChannelBalance')
          }</span>
        </div>
        <Form form={balanceForm} layout='vertical' onFinish={finishForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          {
            formType === 'detail' ? (
              <>
                <Form.Item label={t('order.currency')} name={'currency'} rules={[
                  { required: true, message: t('order.currency') },
                ]}>
                  <DefaultSelect options={exchangeRates.map(item => ({
                    label: item.currencyCode,
                    value: item.currencyCode,
                  }))} multiple={false} placeholder={t('order.currency')} />
                </Form.Item>
                <Form.Item label={t('foundation.groupName')} name={'groupName'} rules={[
                  { required: true, message: t('foundation.groupName') },
                ]}>
                  <Input placeholder={t('foundation.groupName')} />
                </Form.Item>
                <Form.Item label={t('foundation.totalBalance')} name={'totalBalance'} rules={[
                  { required: true, message: t('foundation.totalBalance') },
                ]}>
                  <Input type={'number'} placeholder={t('foundation.totalBalance')} />
                </Form.Item>
                <Form.Item label={t('foundation.lessBalance')} name={'lessBalance'} rules={[
                  { required: true, message: t('foundation.lessBalance') },
                ]}>
                  <Input type={'number'} placeholder={t('foundation.lessBalance')} />
                </Form.Item>
              </>
            )
              :
            <Form.Item label={t('order.paymentName')} name={'accountIds'} rules={[
              { required: true, message: t('order.paymentName') },
            ]}>
              <DefaultSelect options={balanceAccountList.map(item => ({
                label: `${item.accountName}-${item.remarks}`,
                value: item.id,
                description: item.remarks
              }))} multiple={true} placeholder={t('order.paymentName')} />
            </Form.Item>
          }

        </Form>
      </Popup>
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={() => addBalance(null)}>
        <AddOutline fontSize={22} />
      </FloatingBubble>
    </section>
  )
}
