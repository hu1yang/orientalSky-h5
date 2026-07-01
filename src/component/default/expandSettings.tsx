import {forwardRef, useImperativeHandle, useState} from "react";
import {Button, Form, Input, Popup} from "antd-mobile";
import {useTranslation} from "react-i18next";
import {AddCircleOutline} from "antd-mobile-icons";
import type {CommonResponseGroup, ExpandsSettingFormGroup} from "@/types/group.ts";
import {result} from "@/utils/public.ts";

export default forwardRef(function ExpandSettingsForm({axiosFnc,getData}:{
  axiosFnc: (form: ExpandsSettingFormGroup) => Promise<CommonResponseGroup>
  getData:() => void
},ref){

  useImperativeHandle(ref,() => {
    return {
      addProp
    }
  })

  const {t} = useTranslation();
  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [expendForm] = Form.useForm()
  const expandId = Form.useWatch('id',expendForm)
  const expandSettings = Form.useWatch('expandSettings',expendForm)

  const closePop = () => {
    setLoadingBtn(false)
    setVisible(false)
    expendForm.resetFields()
  }

  const expendFormFinish = async (val: ExpandsSettingFormGroup) => {
    const response = await axiosFnc(val)
    result(response)
    if(response.succeed){
      closePop()
      getData()
    }
  }

  const addProp = (form:ExpandsSettingFormGroup) => {
    setVisible(true)
    expendForm.setFieldsValue(form)
  }

  return (
    <Popup
      visible={visible}
      position='right'
      destroyOnClose
      showCloseButton
      onClose={closePop}
      bodyStyle={{width: '100vw', backgroundColor: 'var(--bg)'}}
    >
      <div className={'p-3 my-2 text-center'}>
        <span className={'text-[1.4rem] mb-20'}>{t('group.extensionSettings')}</span>
      </div>
      <Form layout='vertical' form={expendForm} mode='card' onFinish={expendFormFinish} footer={
        <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
          {t('common.submit')}
        </Button>
      } className={'flex flex-col'} style={{
        '--border-top':'0',
        '--border-bottom':'0',
        height: '90%',
        overflow: 'auto',
      }}>
        <Form.Item name={'id'} hidden>
        </Form.Item>
        <Form.Array name={'expandSettings'} onAdd={operation => operation.add({ indexId: expandId })} renderAdd={() => (
          <div className={'flex justify-center items-center'}>
            <AddCircleOutline/>
            <span className={'ml-2'}>{t('common.addBtn')}</span>
          </div>
        )} renderHeader={({ index }, { remove }) => (
          <div>
            <span>{expandSettings?.find((_,b) => b === index).name || '--'}</span>
            <Button fill='none' color={'danger'} size={'mini'} onClick={() => remove(index)} style={{ float: 'right' }}>
              {t('common.delete')}
            </Button>
          </div>
        )}>
          {
            fields => fields.map(({ index }) => (
              <>
                <Form.Item name={[index, 'indexId']} hidden>
                </Form.Item>
                <Form.Item label={t('base.name')} name={[index, 'name']} rules={[
                  { required: true, message: t('base.name') },
                ]}>
                  <Input />
                </Form.Item>
                <Form.Item label={t('base.value')} name={[index, 'value']} rules={[
                  { required: true, message: t('base.value') },
                ]}>
                  <Input />
                </Form.Item>
              </>
            ))
          }
        </Form.Array>
      </Form>
    </Popup>
  )
})
