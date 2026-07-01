import {useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {selectGroupMap} from "@/store/modules/base.ts";

import {Button, Card, Divider, Form, Input, List, Loading, Popup, PullToRefresh, Radio, Space, Tag} from "antd-mobile";
import {getPayedSettingsGroup, updatePayedInvokerGroup, updatePayedSettingExpandsGroup} from "@/utils/request/group.ts";
import type {ExpandsSettingFormGroup, IChannelPayedSettings, IPayedInvokers} from "@/types/group.ts";
import CardText from "@/component/card/cardText.tsx";
import ExpandSettingsForm from "@/component/default/expandSettings.tsx";
import dayjs from "dayjs";
import type {ExpandsSetting} from "@/types/agent.ts";
import {result} from "@/utils/public.ts";

type IChannelPayedSettingsMore = IChannelPayedSettings & {
  groupCode: string[]
}

export default function ChannelPayment() {
  const {t} = useTranslation()
  const groupMap = useSelector(selectGroupMap)

  const [loading, setLoading] = useState(true)
  const [channelList, setChannelList] = useState<IChannelPayedSettingsMore[]>([])

  const [visible, setVisible] = useState(false)
  const [loadingBtn, setLoadingBtn] = useState(false)
  const [inForm] = Form.useForm()

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
    inForm.resetFields()
    setVisible(false)
    setLoadingBtn(false)
  }

  const updateInvoke = (invoke:IPayedInvokers) => {
    inForm.setFieldsValue({
      id: invoke.id,
      isEnabled: invoke.isEnabled,
      timeoutSeconds: invoke.timeoutSeconds
    })
    setVisible(true)
  }

  const inFormFinish = async (val) => {
    setLoadingBtn(true)
    try {
      const response = await updatePayedInvokerGroup(val)
      result(response)
      if(response.succeed){
        closePop()
        getData()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const getData = async () => {
    try {
      const response = await getPayedSettingsGroup()
      const result = response.map((item) => {
        const info = item.branchIds.map(item => {
          return groupMap.get(item).branchCode
        })
        return {
          ...item,
          groupCode: info
        }
      })
      console.log(result)
      setChannelList(result)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getData()
  },[])

  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        {
          !loading ?
            <PullToRefresh onRefresh={getData}>
              {
                channelList.map((item) => (
                  <Card className={'mb-2'} key={item.id} style={{'--adm-card-border-radius': 'var(--rounder-radius)'}}
                        extra={<Tag round color={item?.isEnabled ? 'success' : 'danger'}>
                          {item?.isEnabled ? t('base.enabled') : t('base.disabled')}
                        </Tag>}
                        title={<span
                          className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.accountName}({item.paymentName})</span>}>
                    <div className={'text-left'}>
                      <p className={'line-clamp-1 font-normal text-[1.2rem] !mb-2 text-(--primary-color)'}>{item.groupCode.join(',')}</p>
                      <div className={'mb-4'}>
                        <CardText label={t('group.currency')} value={item.currencyCodes} valueStyle={'text-[1.5rem] !text-[#67c23a]'} />
                        <CardText label={t('quote.expiredTime')} value={item.expirationMinutes} valueStyle={'text-[1.3rem] !text-(--warning-color)'} />
                        <CardText label={t('foundation.description')} value={item.description} valueStyle={'line-clamp-3'}/>
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
                          item.payedInvokers.map(payedInvoker => (
                            <List.Item key={payedInvoker.id} description={`${payedInvoker.timeoutSeconds}(S)`}
                                       onClick={() => updateInvoke(payedInvoker)}>
                              {payedInvoker.invokerType}<Tag round className={'ml-2'}
                                                                color={payedInvoker.isEnabled ? 'success' : 'danger'}>{payedInvoker.isEnabled?t('common.open'):t('common.close')}</Tag>
                            </List.Item>
                          ))
                        }
                      </List>
                      <Divider />
                      <div className={'flex justify-between items-center'}>
                        <span className={'text-(--text) text-[1rem]'}>{dayjs(item.createdTime).format('YYYY-MM-DD HH:MM')}</span>
                        <span className={'text-(--text) text-[1rem]'}>{dayjs(item.updatedTime).format('YYYY-MM-DD HH:MM')}</span>
                      </div>
                    </div>
                  </Card>
                ))
              }
            </PullToRefresh>
            :
            <Loading />
        }
      </div>
      <Popup
        destroyOnClose
        visible={visible}
        onMaskClick={closePop}
      >
        <Form layout='vertical' form={inForm} onFinish={inFormFinish} footer={
          <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
            {t('common.submit')}
          </Button>
        } style={{
          '--border-top':'0',
          '--border-bottom':'0',
        }}>
          <Form.Item hidden name={'id'} />
          <Form.Item label={t('order.isEnabled')} name={'isEnabled'} rules={[
            { required: true, message: t('order.isEnabled') },
          ]}>
            <Radio.Group>
              <Space>
                <Radio value={true}>true</Radio>
                <Radio value={false}>false</Radio>
              </Space>
            </Radio.Group>
          </Form.Item>
          <Form.Item label={t('base.timeoutSeconds')} name={'timeoutSeconds'} rules={[
            { required: true, message: t('base.timeoutSeconds') },
          ]}>
            <Input type={'number'} />
          </Form.Item>
        </Form>
      </Popup>
      <ExpandSettingsForm ref={edSettingRef} getData={getData} axiosFnc={updatePayedSettingExpandsGroup} />
    </section>
  )
}
