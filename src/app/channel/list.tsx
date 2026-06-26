import {useCallback, useEffect, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import dayjs from "dayjs";

import {
  Button,
  Card,
  Divider,
  Form,
  Input,
  List,
  Loading,
  Popup,
  PullToRefresh,
  Radio,
  Space,
  Switch,
  Tag
} from "antd-mobile";
import type {ExpandsSettingFormGroup, IChannelSettings, InvokeProvidersGroup} from "@/types/group.ts";
import {
  getChannelSettingsGroup,
  updateChannelExpandsGroup,
  updateChannelSettingGroup,
  updateInvokeProviderGroup
} from "@/utils/request/group.ts";
import {result} from "@/utils/public.ts";
import CardText from "@/component/card/cardText.tsx";
import ExpandSettingsForm from "@/component/default/expandSettings.tsx";
import type {ExpandsSetting} from "@/types/agent.ts";

export default function ChannelList(){
  const {t} = useTranslation()
  const [loading, setLoading] = useState(true)
  const [channelList, setChannelList] = useState<IChannelSettings[]>([])

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

  const updateInvoke = (invoke:InvokeProvidersGroup) => {
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
      const form = {
        ...val,
        id:inForm.getFieldValue('id')
      }
      const response = await updateInvokeProviderGroup(form)
      result(response)
      if(response.succeed){
        closePop()
        getData()
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const getData = useCallback(async () => {
    try {
      const response = await getChannelSettingsGroup()
      setChannelList(response)
    } finally {
      setLoading(false)
    }
  },[])

  useEffect(()=>{
    getData()
  },[])

  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        {
          !loading?
            <PullToRefresh onRefresh={getData}>
              {
                channelList.map((item) => (
                  <Card className={'mb-2'} key={item.id} style={{'--adm-card-border-radius': 'var(--rounder-radius)'}}
                        extra={
                          <Switch
                            checked={item.isEnabled}
                            style={{
                              '--height': '18px',
                              '--width': '31px'
                            }}
                            onChange={async val => {
                              await updateChannelSettingGroup({
                                id:item.id,
                                isEnabled: val
                              })
                              setTimeout(() => {
                                getData()
                              },200)
                            }}
                          />}
                        title={<span
                          className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.channelName}({item.channelCode})</span>}>
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
                            <CardText key={expandSetting.indexId} label={expandSetting.name} style={'items-start'} value={expandSetting.value} labelStyle={'text-[1.1rem]! w-50!'} valueStyle={'text-right text-[1.3rem]!'} />
                          ))
                        }
                      </div>
                    </div>
                    <List header={t('common.routerChannels')} mode={'card'} className={'m-0!'} style={{
                      '--adm-color-background':'#f5f5f5'
                    }}>
                      {
                        item.invokeProviders.map(invokeProvider => (
                          <List.Item key={invokeProvider.id} description={`${invokeProvider.timeoutSeconds}(S)`}
                                     onClick={() => updateInvoke(invokeProvider)}>
                            {invokeProvider.providerType}<Tag round className={'ml-2'}
                                                              color={invokeProvider.isEnabled ? 'success' : 'danger'}>{invokeProvider.isEnabled?t('common.open'):t('common.close')}</Tag>
                          </List.Item>
                        ))
                      }
                    </List>
                    <Divider />
                    <div className={'flex justify-between items-center'}>
                      <span className={'text-(--text) text-[1rem]'}>{dayjs(item.createdTime).format('YYYY-MM-DD HH:MM')}</span>
                      <span className={'text-(--text) text-[1rem]'}>{dayjs(item.updatedTime).format('YYYY-MM-DD HH:MM')}</span>
                    </div>
                  </Card>
                ))
              }
            </PullToRefresh>:
            <Loading />
        }
      </div>
      <Popup
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
      <ExpandSettingsForm ref={edSettingRef} getData={getData} axiosFnc={updateChannelExpandsGroup} />
    </section>
  )
}
