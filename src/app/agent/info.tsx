import {memo, type RefObject, useEffect, useMemo, useRef, useState} from "react";
import {useParams} from "react-router";
import {useTranslation} from "react-i18next";
import type {RootState} from "@/store";

import {useSelector} from "react-redux";
import dayjs from "dayjs";

import {
  Button,
  Card,
  DatePicker, type DatePickerRef,
  Dialog,
  Form,
  Grid,
  Input,
  Popup,
  PullToRefresh,
  Radio,
  Selector,
  Space,
  Tag
} from "antd-mobile";
import {DownFill} from "antd-mobile-icons";
import CardText from "@/component/card/cardText.tsx";

import {
  addAgentSettingGroup, addDataAccesserGroup, addDataProviderGroup, addFeessSettingGroup, addScaleSettingGroup,
  deleteAgentSettingGroup, deleteDataAccesserGroup, deleteDataProviderGroup, deleteFeessSettingGroup,
  deleteScaleSettingGroup,
  getAgentSettingGroup,
  updateAgentSettingGroup,
  updateDataAccesserGroup, updateDataProviderGroup, updateFeessSettingGroup, updateScaleSettingGroup
} from "@/utils/request/group.ts";
import type { AgentSettingGroup, CommonResponseGroup } from "@/types/group.ts";
import {selectAgentMap} from "@/store/modules/base.ts";

import MobileField from "@/component/form/mobileField.tsx";
import {result} from "@/utils/public.ts";
import type {DataAccessersAgent, FeessSetting, PushProvider, ScaleSetting} from "@/types/agent.ts";


const DefaultButton = memo(({title,color='primary',onClick}:{title:string,color?:"default" | "primary" | "success" | "warning" | "danger" | undefined,onClick?: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;}) => <Button size='mini' color={color} fill='none' className={'!px-1'} onClick={onClick}>{title}</Button>)

type IAgentSettingGroup = AgentSettingGroup & {
  branchCode: string
  agentCode:string
}
type DialogType = 'feessSettings'|'scaleSettings'|'pushProviders'|'agentSetting'|'dataAccessers'

const providerTypeValue = ['notifyEvents', 'issuedTicket', 'rejectTicket', 'refundTicket', 'rejectRefund', 'changeTicket', 'rejectChange','appendTicket','rejectAppend', 'issuedAmount', 'rejectAmount']

export default function AgentInfo() {
  const {t} = useTranslation()
  const loadingRef = useRef(false)
  const {id} = useParams()

  const agentMap = useSelector(selectAgentMap)
  const {channel} = useSelector((state: RootState) => state.baseInfo);

  const [agentDetail, setAgentDetail] = useState<IAgentSettingGroup|null>(null)

  const [buttonLoading, setButtonLoading] = useState(false)
  const [typeForm, setTypeForm] = useState<DialogType|null>(null)
  const [infoVisible, setInfoVisible] = useState(false)
  const [infoForm] = Form.useForm()

  const channelMemo = useMemo(() => {
    return channel.map(item => ({
      label:item.channelName,
      value:item.channelCode,
    }))
  },[channel])

  const changeInfo = (type:DialogType,row:IAgentSettingGroup|FeessSetting|ScaleSetting|PushProvider|DataAccessersAgent|null = null) => {
    setInfoVisible(true)
    setTypeForm(type)
    switch (type){
      case 'agentSetting':
        { const detail = {...row} as IAgentSettingGroup
          infoForm.setFieldsValue({
            id:detail?.id,
            agentId:detail?.agentId || '',
            isEnabled:detail?.isEnabled,
            contactName:detail?.contactName,
            phoneNumber:detail?.phoneNumber,
            emailAddress:detail?.emailAddress,
            channelCodes:detail?.channelCodes
          })
        }
        break
      case 'feessSettings':
        {
          if(row){
            const detail = {...row} as FeessSetting
            infoForm.setFieldsValue({
              id:detail.id,
              agentSettingId: detail.agentSettingId,
              isEnabled: detail?.isEnabled,
              issuedDate: dayjs(detail.issuedDate).toDate(),
              voidedFeesAmount: detail.voidedFeesAmount,
              appendFeesAmount: detail.appendFeesAmount,
              refundFeesAmount: detail.refundFeesAmount,
              changeFeesAmount: detail.changeFeesAmount,
              orderRangeAmount: detail.orderRangeAmount,
              payedRangeAmount: detail.payedRangeAmount
            })
          }else{
            infoForm.setFieldsValue({
              agentSettingId: agentDetail?.id,
              issuedDate: dayjs().toDate(),
              isEnabled: true,
            })
          }

        }
        break
      case 'scaleSettings':
        {
          if(row){
            const detail = {...row} as ScaleSetting
            infoForm.setFieldsValue({
              id:detail.id,
              agentSettingId: detail.agentSettingId,
              isEnabled: detail?.isEnabled,
              scaleLimitedDaysLength: detail?.scaleLimitedDaysLength,
              scaleLimited: detail?.scaleLimited,
              issuedDate: dayjs(detail.issuedDate).toDate(),
              scaleLimitedFineByOnce: detail?.scaleLimitedFineByOnce,
            })
          }else{
            infoForm.setFieldsValue({
              agentSettingId: agentDetail?.id,
              issuedDate: dayjs().toDate(),
              isEnabled: true,
            })
          }
        }
        break
      case 'pushProviders':
        {
          if(row){
            const detail = {...row} as PushProvider
            infoForm.setFieldsValue({
              id:detail.id,
              agentSettingId: detail.agentSettingId,
              isEnabled: detail.isEnabled,
              timeoutSeconds: detail.timeoutSeconds,
              request_Url: detail.request_Url,
              providerType: detail.providerType || 'notifyEvents'
            })
          }else{
            infoForm.setFieldsValue({
              agentSettingId: agentDetail?.id,
              isEnabled: true,
              providerType: 'notifyEvents'
            })
          }
        }
        break
      case 'dataAccessers':
        {
          if(row){
            const detail = {...row} as DataAccessersAgent
            infoForm.setFieldsValue({
              id:detail.id,
              agentSettingId: detail.agentSettingId,
              isEnabled: detail.isEnabled,
              remoteAddress: detail.remoteAddress,
            })
          }else{
            infoForm.setFieldsValue({
              agentSettingId: agentDetail?.id,
              isEnabled: true,
            })
          }
        }
        break
    }
  }

  const closeInfoVisible = () => {
    setInfoVisible(false)
    setTypeForm(null)
    infoForm.resetFields()
  }
  const finishForm = async (val) => {
    setButtonLoading(true)
    try{
      let response:CommonResponseGroup|null = null
      switch (typeForm){
        case 'agentSetting':
          if(!agentDetail?.agentId){
            response = await addAgentSettingGroup({
              ...val,
              agentId:infoForm.getFieldValue('agentId')
            })
          }else{
            response = await updateAgentSettingGroup({
              ...val,
              id:infoForm.getFieldValue('id')
            })
          }
          break
        case 'feessSettings':
          if (infoForm.getFieldValue('id')){
            response = await updateFeessSettingGroup({
              ...val,
              issuedDate:dayjs(val.issuedDate).format('YYYY-MM-DD'),
              id:infoForm.getFieldValue('id')
            })
          }else{
            response = await addFeessSettingGroup({
              ...val,
              issuedDate:dayjs(val.issuedDate).format('YYYY-MM-DD'),
              agentSettingId:infoForm.getFieldValue('agentSettingId')
            })
          }
          break
        case 'scaleSettings':
          if (infoForm.getFieldValue('id')) {
            response = await updateScaleSettingGroup({
              ...val,
              issuedDate:dayjs(val.issuedDate).format('YYYY-MM-DD'),
              id:infoForm.getFieldValue('id')
            })
          }else{
            response = await addScaleSettingGroup({
              ...val,
              issuedDate:dayjs(val.issuedDate).format('YYYY-MM-DD'),
              agentSettingId:infoForm.getFieldValue('agentSettingId')
            })
          }
          break
        case 'pushProviders':
          if (infoForm.getFieldValue('id')) {
            response = await updateDataProviderGroup({
              ...val,
              id:infoForm.getFieldValue('id')
            })
          }else{
            response = await addDataProviderGroup({
              ...val,
              agentSettingId:infoForm.getFieldValue('agentSettingId')
            })
          }
          break
        case 'dataAccessers':
          if (infoForm.getFieldValue('id')) {
            response = await updateDataAccesserGroup({
              ...val,
              id:infoForm.getFieldValue('id')
            })
          }else{
            response = await addDataAccesserGroup({
              ...val,
              agentSettingId:infoForm.getFieldValue('agentSettingId')
            })
          }
          break
      }
      if(response){
        result(response)
        if(response.succeed){
          closeInfoVisible()
          getData()
        }
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const delBase = (type:DialogType,id:string) => {
    Dialog.confirm({
      content: t('common.delTips'),
      onConfirm: async () => {
        try{
          let response:CommonResponseGroup
          switch (type) {
            case "agentSetting":
              response = await deleteAgentSettingGroup(id as string)
              break
            case "feessSettings":
              response = await deleteFeessSettingGroup(id)
              break
            case "pushProviders":
              response = await deleteDataProviderGroup(id)
              break
            case 'dataAccessers':
              response = await deleteDataAccesserGroup(id)
              break
            case "scaleSettings":
              response = await deleteScaleSettingGroup(id)
              break
          }
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

  const popupTitle = useMemo(() => {
    let name = ''
    switch (typeForm){
      case 'agentSetting':
        name = t('base.baseInfo')
        break
      case 'feessSettings':
        name = t('base.feessSettings')
        break
      case 'scaleSettings':
        name = t('base.scaleSettings')
        break
      case 'pushProviders':
        name = t('base.pushProviders')
        break
      case 'dataAccessers':
        name = t('base.dataAccessers')
        break
    }
    return name
  },[typeForm])

  const renderIsEnabled = () => {
    return (
      <Form.Item label={t('base.isEnabled')} name={'isEnabled'} >
        <Radio.Group>
          <Space>
            {
              [{label:t('common.open'),value:true},{label:t('common.close'),value:false}].map(radio => (
                <Radio value={radio.value}  style={{
                  '--icon-size': '18px',
                  '--font-size': '14px',
                  '--gap': '6px',
                }}>{radio.label}</Radio>
              ))
            }
          </Space>
        </Radio.Group>
      </Form.Item>
    )
  }

  const renderFormFiled = () => {
    switch (typeForm){
      case 'agentSetting':
        return (
          <>
            {renderIsEnabled()}
            <Form.Item label={t('order.contact')} name={'contactName'} rules={[
              { required: true, message: t('base.contactName') },
              { pattern: /^[a-zA-Z]+\/[a-zA-Z]+$/, message: 'Sure name / Given name' },
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('base.phoneNumber')} name={'phoneNumber'} rules={[
              { required: true, message: t('base.phoneNumber') },
            ]}>
              <MobileField />
            </Form.Item>
            <Form.Item label={t('base.emailAddress')} name={'emailAddress'} rules={[
              { required: true, message: t('group.emailRequired') },
              { type: 'email', warningOnly: true, message: t('group.emailInvalid') },
            ]}>
              <Input placeholder={t('group.emailRequired')} />
            </Form.Item>
            <Form.Item label={t('base.channelCodes')} name={'channelCodes'} rules={[
              { required: true, message: t('base.channelCodes') },
            ]}>
              <Selector columns={3} multiple options={channelMemo} />
            </Form.Item>
          </>
        )
        break
      case 'feessSettings':
        return (
          <>
            {renderIsEnabled()}
            <Form.Item label={t('base.issuedDate')} name={'issuedDate'} trigger='onConfirm'
                       onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
                         datePickerRef.current?.open()
                       }}>
              <DatePicker>
                {value =>
                  value ? dayjs(value).format('YYYY-MM-DD') : t('base.issuedDate')
                }
              </DatePicker>
            </Form.Item>
            <Form.Item label={t('base.voidedFeesAmount')} name={'voidedFeesAmount'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.appendFeesAmount')} name={'appendFeesAmount'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.refundFeesAmount')} name={'refundFeesAmount'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.changeFeesAmount')} name={'changeFeesAmount'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.orderRangeAmount')} name={'orderRangeAmount'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.payedRangeAmount')} name={'payedRangeAmount'}>
              <Input type={'number'} />
            </Form.Item>
          </>
        )
        break
      case 'scaleSettings':
        return (
          <>
            {renderIsEnabled()}
            <Form.Item label={t('base.issuedDate')} name={'issuedDate'} trigger='onConfirm'
                       onClick={(_, datePickerRef: RefObject<DatePickerRef>) => {
                         datePickerRef.current?.open()
                       }}>
              <DatePicker>
                {value =>
                  value ? dayjs(value).format('YYYY-MM-DD') : t('base.issuedDate')
                }
              </DatePicker>
            </Form.Item>
            <Form.Item label={t('base.unpaidForwardDaysLength')} name={'scaleLimitedDaysLength'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.scaleLimited')} name={'scaleLimited'}>
              <Input type={'number'} />
            </Form.Item>
            <Form.Item label={t('base.queryOrQuoteScaleLimited')} name={'scaleLimitedFineByOnce'}>
              <Input type={'number'} />
            </Form.Item>
          </>
        )
        break
      case 'pushProviders':
        return (
          <>
            {renderIsEnabled()}
            <Form.Item label={t('base.providerType')} name={'providerType'} rules={[
              { required: true, message: t('base.providerType') },
            ]}>
              <Radio.Group>
                <Space wrap>
                  {
                    providerTypeValue.map(providerType => (
                      <Radio value={providerType}  style={{
                        '--icon-size': '18px',
                        '--font-size': '14px',
                        '--gap': '6px',
                      }}>{providerType}</Radio>
                    ))
                  }
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={t('base.requestUrl')} name={'request_Url'} rules={[
              { required: true, message: t('base.requestUrl') },
              { pattern: /^https?:\/\/.+/, message: 'http/https' },
            ]}>
              <Input />
            </Form.Item>
            <Form.Item label={t('base.timeoutSeconds')} name={'timeoutSeconds'} rules={[
              { required: true, message: t('base.timeoutSeconds') },
            ]}>
              <Input />
            </Form.Item>
          </>
        )
      break
      case 'dataAccessers':
        return (
          <>
            {renderIsEnabled()}
            <Form.Item label={t('group.remoteAddress')} name={'remoteAddress'} rules={[
              { required: true, message: t('group.remoteAddress') },
              { pattern: /^((25[0-5]|(2[0-4]|1\d|[1-9]|)\d)\.?\b){4}$/, message: t('group.sureIpAddress') },
            ]}>
              <Input />
            </Form.Item>
          </>
        )
        break
    }
  }

  const getData = async () => {
    if (loadingRef.current) return
    loadingRef.current = true
    try{
      const response = await getAgentSettingGroup(id || '')
      if(Object.keys(response).length){
        const info = agentMap.get(response.agentId)
        setAgentDetail({
          ...response,
          branchCode: info?.branchCode,
          agentCode: info?.agentCode
        })
      }
    } finally {
      loadingRef.current = false
    }
  }

  useEffect(() => {
    getData()
  }, []);

  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        <PullToRefresh onRefresh={getData}>
          <Card className={'mb-2'} style={{ borderRadius: '4px' }}
                extra={
                  <Space>
                    <DefaultButton title={t('group.renew')} onClick={() => changeInfo('agentSetting',agentDetail)} />
                    <DefaultButton title={t('common.delete')} color={'danger'} onClick={() => delBase('agentSetting',agentDetail?.id as string)} />
                  </Space>
                }
                title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.baseInfo')}({agentDetail?.agentCode})</span>}>
            <CardText label={t('base.contactName')} value={agentDetail?.contactName} />
            <CardText label={t('base.phoneNumber')} value={agentDetail?.phoneNumber} />
            <CardText label={t('base.emailAddress')} value={agentDetail?.emailAddress} />
            <CardText label={t('base.localAddress')} value={agentDetail?.localAddress} />
            <CardText label={t('base.isEnabled')} value={<Tag round color={agentDetail?.isEnabled ? 'success' : 'danger'}>
              {agentDetail?.isEnabled ? t('base.enabled') : t('base.disabled')}
            </Tag>} />
            <CardText label={t('base.remarks')} value={agentDetail?.remarks} />
            <CardText label={t('base.operator')} value={agentDetail?.operator} />
            <CardText label={t('base.channelCodes')} value={
              <Space wrap style={{ '--gap': '4px' }}>
                {
                  agentDetail?.channelCodes?.map(channel => <Tag color='#2db7f5' key={channel}>{channel}</Tag>)
                }
              </Space>
            } />
          </Card>
          <Card className={'mb-2'} style={{ borderRadius: '4px' }} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.feessSettings')}</span>} extra={
            <DefaultButton title={t('common.add')} color={'warning'} onClick={() => changeInfo('feessSettings',null)} />
          }>
            {
              agentDetail?.feessSettings.map(feessSetting => (
                <Grid columns={2} gap={8} key={feessSetting.id}>
                  <Grid.Item>
                    <div className={'flex items-center'}>
                      <DownFill className={'rotate-270 mr-2 text-(--text)'} fontSize={'.9rem'} />
                      <span className={'mr-2'}>{feessSetting.id}</span>
                      <Tag round color={feessSetting.isEnabled ? 'success' : 'danger'}>{feessSetting.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <Space justify={'end'} block>
                      <DefaultButton title={t('group.renew')} onClick={() => changeInfo('feessSettings',feessSetting)} />
                      <DefaultButton title={t('common.delete')} color={'danger'} onClick={() => delBase('feessSettings',feessSetting.id)} />
                    </Space>
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.startDate')} value={feessSetting.issuedDate} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.voidedFeesAmount')} value={feessSetting.voidedFeesAmount} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.appendFeesAmount')} value={feessSetting.appendFeesAmount} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.refundFeesAmount')} value={feessSetting.refundFeesAmount} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.changeFeesAmount')} value={feessSetting.changeFeesAmount} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.defaultPurchaseRange')} value={feessSetting.orderRangeAmount} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.defaultPaymentRange')} value={feessSetting.payedRangeAmount} />
                  </Grid.Item>

                </Grid>
              ))
            }
          </Card>

          <Card className={'mb-2'} style={{ borderRadius: '4px' }} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.scaleSettings')}</span>} extra={
            <DefaultButton title={t('common.add')} color={'warning'} onClick={() => changeInfo('scaleSettings',null)} />
          }>
            {
              agentDetail?.scaleSettings.map(scaleSetting => (
                <Grid columns={2} gap={8} key={scaleSetting.id}>
                  <Grid.Item>
                    <div className={'flex items-center'}>
                      <DownFill className={'rotate-270 mr-2 text-(--text)'} fontSize={'.9rem'} />
                      <span className={'mr-2'}>{scaleSetting.id}</span>
                      <Tag round color={scaleSetting.isEnabled ? 'success' : 'danger'}>{scaleSetting.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>
                    </div>
                  </Grid.Item>
                  <Grid.Item>
                    <Space justify={'end'} block>
                      <DefaultButton title={t('group.renew')} onClick={() => changeInfo('scaleSettings',scaleSetting)} />
                      <DefaultButton title={t('common.delete')} color={'danger'} onClick={() => delBase('scaleSettings',scaleSetting.id)} />
                    </Space>
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.startDate')} value={scaleSetting.issuedDate} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.unpaidForwardDaysLength')} value={scaleSetting.scaleLimitedDaysLength} labelStyle={'!w-40'} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.scaleLimited')} value={scaleSetting.scaleLimited} />
                  </Grid.Item>
                  <Grid.Item>
                    <CardText label={t('base.queryOrQuoteScaleLimited')} value={scaleSetting.scaleLimitedFineByOnce} labelStyle={'!w-40'} />
                  </Grid.Item>

                </Grid>
              ))
            }

          </Card>
          <Card className={'mb-2'} style={{ borderRadius: '4px' }} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.pushProviders')}</span>} extra={
            <DefaultButton title={t('common.add')} color={'warning'} onClick={() => changeInfo('pushProviders',null)} />
          }>
            {
              agentDetail?.pushProviders.map(pushProvider => (
                <Grid columns={6} className={'!items-center w-full'} key={pushProvider.id}>
                  <Grid.Item span={2}>
                    <span className={'line-clamp-1 break-all'}>{pushProvider.request_Url}</span>
                  </Grid.Item>
                  <Grid.Item span={2}>
                    <span>{pushProvider.providerType}</span>
                  </Grid.Item>
                  <Grid.Item span={1}>
                    <span>{pushProvider.timeoutSeconds}</span>
                  </Grid.Item>
                  <Grid.Item span={1}>
                    <div className={'text-center'}>
                      <Tag round color={pushProvider.isEnabled ? 'success' : 'danger'}>{pushProvider.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>
                    </div>
                  </Grid.Item>
                  <Grid.Item span={6}>
                    <Space justify={'end'} block>
                      <DefaultButton title={t('group.renew')}  onClick={() => changeInfo('pushProviders',pushProvider)} />
                      <DefaultButton title={t('common.delete')} color={'danger'} onClick={() => delBase('pushProviders',pushProvider.id)} />
                    </Space>
                  </Grid.Item>
                </Grid>
              ))
            }
          </Card>
          <Card className={'mb-2'} style={{ borderRadius: '4px' }} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.dataAccessers')}</span>} extra={
            <DefaultButton title={t('common.add')} color={'warning'} onClick={() => changeInfo('dataAccessers',null)} />
          }>
            {
              agentDetail?.dataAccessers.map(dataAccesser => (
                <Grid columns={6} className={'!items-center w-full'} key={dataAccesser.id}>
                  <Grid.Item span={2}>
                    <span>{dataAccesser.remoteAddress}</span>
                  </Grid.Item>
                  <Grid.Item span={1}>
                    <div className={'text-center'}>
                      <Tag round color={dataAccesser.isEnabled ? 'success' : 'danger'}>{dataAccesser.isEnabled ? t('base.enabled') : t('base.disabled')}</Tag>
                    </div>
                  </Grid.Item>
                  <Grid.Item span={3}>
                    <Space justify={'end'} block>
                      <DefaultButton title={t('group.renew')} onClick={() => changeInfo('dataAccessers',dataAccesser)} />
                      <DefaultButton title={t('common.delete')} color={'danger'} onClick={() => delBase('dataAccessers',dataAccesser.id)} />
                    </Space>
                  </Grid.Item>
                </Grid>
              ))
            }
          </Card>
        </PullToRefresh>
      </div>
      <Popup visible={infoVisible} position='bottom' onMaskClick={closeInfoVisible}>
        <div className={'p-3 my-2 text-center'}>
          <span className={'text-[1.4rem] mb-20'}>{popupTitle}</span>
        </div>
        <Form form={infoForm} layout='vertical' onFinish={finishForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          {renderFormFiled()}
        </Form>
      </Popup>
    </section>
  )
}
