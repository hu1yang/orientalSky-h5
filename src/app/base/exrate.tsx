import {type RefObject, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {
  Button,
  Card, DatePicker,
  type DatePickerRef,
  Dialog,
  Divider, FloatingBubble,
  Form,
  Input,
  Loading,
  Popup,
  PullToRefresh, SearchBar,
  Space
} from "antd-mobile";
import {deleteExchangeRateGroup, getExchangeRatesGroup, upsertExchangeRateGroup} from "@/utils/request/group.ts";
import type {IExchangeRate, IExchangeRateForm} from "@/types/group.ts";
import CardText from "@/component/card/cardText.tsx";
import {result} from "@/utils/public.ts";
import {AddOutline} from "antd-mobile-icons";

export default function BaseExrate() {
  const {t} = useTranslation()

  const [keyword, setKeyword] = useState('')

  const [loading, setLoading] = useState(true)
  const [listValue, setListValue] = useState<IExchangeRate[]>([])

  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [exrateForm] = Form.useForm()


  const renewInfo = (row:IExchangeRate) => {
    exrateForm.setFieldsValue({
      currencyCode: row.currencyCode,
      englishName: row.englishName,
      chineseName: row.chineseName,
      buyingRate: row.buyingRate,
      cashBuyingRate: row.cashBuyingRate,
      sellingRate: row.sellingRate,
      cashSellingRate: row.cashSellingRate,
      middleRate: row.middleRate,
      publishTime: dayjs(row.publishTime).toDate()
    })
    setVisible(true)
  }

  const closeVisible = () => {
    exrateForm.resetFields()
    setLoadingBtn(false)
    setVisible(false)
  }

  const onExrateFormFinish = async (val:IExchangeRateForm) => {
    setLoadingBtn(true)
    try {
      const form = {
        ...val,
        publishTime: dayjs(val.publishTime).format('YYYY-MM-DDTHH:mm:ssZ') || dayjs().format('YYYY-MM-DDTHH:mm:ssZ')
      }
      const response = await upsertExchangeRateGroup(form)
      result(response)
      if(response.succeed){
        getData()
        closeVisible()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const delExrate = (id:string) => {
    Dialog.confirm({
      content: t('common.delTips'),
    }).then(async () => {
      const response = await deleteExchangeRateGroup(id)
      result(response)
      if(response.succeed){
        setListValue(prevState =>
          prevState.filter(a => a.id !== id)
        )
      }
    })
  }

  const listValueMemo = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return listValue.filter(item => {
      return item.currencyCode ? item.currencyCode.toLowerCase().includes(lowerKeyword) : false;
    });
  }, [keyword, listValue])

  const getData = async () => {
    try {
      const response = await getExchangeRatesGroup()
      if(response){
        setListValue(response)
      }
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('order.currency')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} onSearch={setKeyword} onClear={() => setKeyword('')} />
      </div>
      <div className={'p-2'}>
        {
          !loading ?
            <PullToRefresh onRefresh={getData}>
              {
                listValueMemo.map((item: IExchangeRate) => (
                  <Card className={'mb-2'} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.currencyCode}</span>}
                        key={item.id}>
                    <div>
                      <CardText label={t('foundation.exchangeRateMidpoint')} value={item.middleRate} labelStyle={'w-50!'} />
                      <CardText label={t('foundation.spotBuyingRate')} value={item.buyingRate} labelStyle={'w-50!'} />
                      <CardText label={t('foundation.cashBuyingRate')} value={item.cashBuyingRate} labelStyle={'w-50!'} />
                      <CardText label={t('foundation.spotSellingRate')} value={item.sellingRate} labelStyle={'w-50!'} />
                      <CardText label={t('foundation.cashSellingRate')} value={item.cashSellingRate} labelStyle={'w-50!'} />
                    </div>
                    <Divider/>
                    <div className={'flex justify-end'}>
                      <Space justify={'end'}>
                        <Button shape='rounded' size={'small'} color='danger' onClick={() => delExrate(item.id as string)}>{t('order.delete')}</Button>
                        <Button shape='rounded' size={'small'} color='primary' onClick={() => renewInfo(item)}>{t('group.renew')}</Button>
                      </Space>
                    </div>
                  </Card>
                ))
              }
            </PullToRefresh>
            :
            <Loading />
        }
      </div>
      <Popup visible={visible} destroyOnClose onMaskClick={closeVisible}>
        <Form form={exrateForm} mode={'card'} onFinish={onExrateFormFinish} footer={
          <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
            {t('common.submit')}
          </Button>
        }>
          <Form.Item label={t('foundation.currencyCode')} name={'currencyCode'} rules={[
            { required: true, message: t('foundation.currencyCode') },
            { min: 3, max: 3, message: t('common.threeTips') },
          ]}>
            <Input min={3} max={3} />
          </Form.Item>
          <Form.Item label={'EN'} name={'englishName'} hidden>
          </Form.Item>
          <Form.Item label={'CN'} name={'chineseName'} hidden>
          </Form.Item>
          <Form.Item label={t('foundation.spotBuyingRate')} name={'buyingRate'} rules={[
            { required: true, message: t('foundation.spotBuyingRate') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
          <Form.Item label={t('foundation.cashBuyingRate')} name={'cashBuyingRate'} rules={[
            { required: true, message: t('foundation.cashBuyingRate') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
          <Form.Item label={t('foundation.spotSellingRate')} name={'sellingRate'} rules={[
            { required: true, message: t('foundation.spotSellingRate') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
          <Form.Item label={t('foundation.cashSellingRate')} name={'cashSellingRate'} rules={[
            { required: true, message: t('foundation.cashSellingRate') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
          <Form.Item label={t('foundation.middleRate')} name={'middleRate'} rules={[
            { required: true, message: t('foundation.middleRate') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
          <Form.Item label={t('foundation.publishTime')} name={'publishTime'} trigger='onConfirm'
                     onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
                       datePickerRef.current?.open()
                     }}>
            <DatePicker precision='minute'>
              {value =>
                value ? dayjs(value).format('YYYY-MM-DD HH:mm') : t('foundation.publishTime')
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
