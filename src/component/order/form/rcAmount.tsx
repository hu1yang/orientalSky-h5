import {forwardRef, memo, useImperativeHandle, useState} from "react";
import {Button, Form, Input, Popup, Radio, Space, TextArea} from "antd-mobile";
import {useTranslation} from "react-i18next";
import type {Passenger, UpOrderRCAmounts} from "@/types/order.ts";
import {upsertChangeAmountsGroup, upsertRefundAmountsGroup} from "@/utils/request/group.ts";
import {result} from "@/utils/public.ts";


export default memo(forwardRef(function RCAmount({resetDetailFnc,type}: {
  resetDetailFnc: () => void
  type: 'change'|'refund'
}, ref) {
  const {t} = useTranslation()
  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const [form] = Form.useForm()

  useImperativeHandle(ref, () => {
    return {
      openSurePop: sureAmount
    }
  })

  const sureAmount = (passengers: Passenger[],id: string) => {
    setVisiblePop(true)

    const newAmounts = passengers.map(passenger => ({
      fullName: passenger.fullName,
      idNumber: passenger.idNumber,
      deductionAmount: '0',
      netServiceFees: '0',
    }))
    form.setFieldsValue({
      id:id,
      remarks: '',
      sureNow: true,
      amounts: newAmounts,
    })
  }

  const onFinish = async (val: UpOrderRCAmounts) => {
    setLoadingBtn(true)
    try {
      const formData = {
        ...val,
        amounts: val.amounts.map(amount => ({
          ...amount,
          othersNotes:amount.othersNotes ? (amount.othersNotes as string).split('\n'): []
        })),
        changeId: form.getFieldValue('id'),
        refundId: form.getFieldValue('id')
      }
      let response
      if(type === 'change'){
        response = await upsertChangeAmountsGroup(formData, formData.sureNow as boolean)
      }else{
        response = await upsertRefundAmountsGroup(formData, formData.sureNow as boolean)
      }
      if(response){
        result(response)
        if (response.succeed) {
          closePop()
          resetDetailFnc()
        }
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const closePop = () => {
    setVisiblePop(false)
    form.resetFields()
  }

  return (
    <Popup visible={visiblePop} position='right' showCloseButton onClose={closePop}
           bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}>
      <div className={'py-20 px-1 h-full flex flex-col'}>
        <div className={'overflow-auto'}>
          <Form form={form} mode='card' onFinish={onFinish}
                footer={
                  <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
                    {t('common.submit')}
                  </Button>
                }>
            <Form.Array name={'amounts'}>
              {
                fields => fields.map(({index}) => (
                  <>
                    <Form.Item name={[index, 'fullName']} label={t('order.travelerName')}>
                      <Input placeholder={t('order.travelerName')} disabled/>
                    </Form.Item>
                    <Form.Item name={[index, 'idNumber']} label={t('order.travelerIdNo')}>
                      <Input placeholder={t('order.travelerName')} disabled/>
                    </Form.Item>
                    <Form.Item name={[index, 'netServiceFees']} label={t('order.netServiceFees')} rules={[
                      {required: true, message: t('order.netServiceFees')},
                    ]}>
                      <Input placeholder={t('order.netServiceFees')} type={'number'}/>
                    </Form.Item>
                    <Form.Item name={[index, 'deductionAmount']} label={t('order.deductionAmount')} rules={[
                      {required: true, message: t('order.deductionAmount')},
                    ]}>
                      <Input placeholder={t('order.deductionAmount')} type={'number'}/>
                    </Form.Item>
                    {
                      type === 'change'?
                        <Form.Item name={[index, 'netChangeAmount']} label={t('order.netChangeAmount')} rules={[
                          {required: true, message: t('order.netChangeAmount')},
                        ]}>
                          <Input placeholder={t('order.netChangeAmount')} type={'number'}/>
                        </Form.Item>
                        :
                        <Form.Item name={[index, 'netRefundAmount']} label={t('order.netRefundAmount')} rules={[
                          {required: true, message: t('order.netRefundAmount')},
                        ]}>
                          <Input placeholder={t('order.netRefundAmount')} type={'number'}/>
                        </Form.Item>
                    }

                    <Form.Item name={[index, 'othersNotes']} label={t('foundation.othersNotes')}>
                      <TextArea
                        placeholder={t('foundation.othersNotes')}
                        maxLength={100}
                        rows={2}
                        showCount
                      />
                    </Form.Item>
                  </>
                ))
              }
            </Form.Array>
            <Form.Item name={'remarks'} label={t('base.remarks')}>
              <TextArea
                placeholder={t('base.remarks')}
                maxLength={100}
                rows={2}
                showCount
              />
            </Form.Item>
            <Form.Item name={'sureNow'} label={t('order.sureNow')}>
              <Radio.Group>
                <Space>
                  <Radio value={true}>true</Radio>
                  <Radio value={false}>false</Radio>
                </Space>
              </Radio.Group>
            </Form.Item>
          </Form>
        </div>
      </div>
    </Popup>
  )
}))
