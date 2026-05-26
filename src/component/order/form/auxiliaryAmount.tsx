import {forwardRef, memo, useImperativeHandle, useState} from "react";
import {useTranslation} from "react-i18next";

import {Button, Form, Input, Popup, TextArea} from "antd-mobile";
import type {UpOrderAppendAmounts} from "@/types/order.ts";
import {upsertAppendAmountsGroup} from "@/utils/request/group.ts";
import {result} from "@/utils/public.ts";

export default memo(forwardRef(function AuxiliaryAmount({resetDetailFnc}:{
  resetDetailFnc: () => void
},ref){
  const {t} = useTranslation()
  const [visiblePop, setVisiblePop] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [form] = Form.useForm()

  useImperativeHandle(ref,() => {
    return {
      openSurePop: sureAmount
    }
  })

  const sureAmount = (id:string) => {
    setVisiblePop(true)
    form.setFieldsValue({
      appendId:id,
      laborServiceFees:0
    })
  }

  const onFinish = async (val:UpOrderAppendAmounts) => {
    setLoadingBtn(true)
    try {
      const formData = {
        ...val,
        appendId:form.getFieldValue('appendId'),
      }
      const response = await upsertAppendAmountsGroup(formData,true)
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
            <Form.Item name={'laborServiceFees'} label={t('order.laborServiceFeesAuxiliary')} rules={[
              {required: true, message: t('order.laborServiceFeesAuxiliary')},
            ]}>
              <Input placeholder={t('order.laborServiceFeesAuxiliary')} type={'number'}/>
            </Form.Item>
            <Form.Item name={'netPaymentAmount'} label={t('order.netPaymentAmountAuxiliary')} rules={[
              {required: true, message: t('order.netPaymentAmountAuxiliary')},
            ]}>
              <Input placeholder={t('order.netPaymentAmountAuxiliary')} type={'number'}/>
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
  )
}))
