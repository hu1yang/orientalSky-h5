import {useEffect, useMemo, useState} from "react";

import {Button, Card, Divider, Form, Grid, Input, Loading, Popup, PullToRefresh, Space, Tag, Toast} from "antd-mobile";
import {getUserEntityGroup, personalUpdatePassword, UpdateUserInfoGroup} from "@/utils/request/identity.ts";
import type {UserResponse} from "@/types/identity.ts";
import {useTranslation} from "react-i18next";
import CardText from "@/component/card/cardText.tsx";
import dayjs from "dayjs";
import MobileField from "@/component/form/mobileField.tsx";

export default function Personal(){
  const {t} = useTranslation();

  const [loading, setLoading] = useState(true)
  const [userDetail, setUserDetail] = useState<UserResponse|null>(null)

  const [infoVisible, setInfoVisible] = useState(false)
  const [typeForm, setTypeForm] = useState<'password'|'info'>('info')
  const [buttonLoading, setButtonLoading] = useState(false)
  const [infoForm] = Form.useForm()


  const finishForm = async (val) => {
    setButtonLoading(true)
    let response
    switch (typeForm) {
      case 'password':
        response = await personalUpdatePassword(val)
        break
      case 'info':
        response = await UpdateUserInfoGroup(val)
        break
    }
    if(response.succeeded){
      Toast.show({
        icon: 'success',
        content: t('common.operationSuccessful'),
      })

    }else{
      Toast.show({
        icon: 'fail',
        content: response.errors[0].description,
      })
    }
    if(response.succeeded){
      getData()
      setButtonLoading(false)
      setInfoVisible(false)
    }
  }

  const popupTitle = useMemo(() => {
    let name = ''
    switch (typeForm){
      case 'info':
        name = t('personal.updateUserInfo')
        break
      case 'password':
        name = t('personal.changePassword')
        break

    }
    return name
  },[typeForm])

  const renderFormFiled = () => {
    switch (typeForm){
      case 'info':
        return (
          <>
            <Form.Item label={t('group.emailAddress')} name={'emailAddress'} rules={[
              { required: true, message: t('group.emailRequired') },
              { type: 'email', warningOnly: true, message: t('group.emailInvalid') },
            ]}>
              <Input placeholder={t('group.emailAddress')} />
            </Form.Item>
            <Form.Item label={t('group.phoneNumber')} name={'phoneNumber'} rules={[
              { required: true, message: t('group.phoneNumber') },
            ]}>
              <MobileField />
            </Form.Item>
          </>
        )
        break
      case 'password':
        return (
          <>
            <Form.Item label={t('personal.oldPassword')} name={'oldPassword'} rules={[
              { required: true, message: t('personal.oldPassword') },
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/, message: t('login.enterPassWordTip') },
            ]}>
              <Input placeholder={t('personal.oldPassword')} />
            </Form.Item>
            <Form.Item label={t('personal.newPassword')} name={'newPassword'} rules={[
              {required: true, message: t('personal.newPassword')},
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/, message: t('login.enterPassWordTip') },
            ]}>
              <Input placeholder={t('personal.newPassword')} type={'password'} />
            </Form.Item>
            <Form.Item label={t('personal.confirmPassword')} name={'confirmPassword'} rules={[
              {required: true, message: t('personal.confirmPassword')},
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/, message: t('login.enterPassWordTip') },
            ]}>
              <Input placeholder={t('personal.confirmPassword')} type={'password'} />
            </Form.Item>
          </>
        )
        break
    }
  }

  const renewInfo = (type:'info'|'password') => {
    setTypeForm(type)
    setInfoVisible(true)
    if(typeForm === 'info'){
      infoForm.setFieldsValue({
        emailAddress:userDetail?.user.emailAddress,
        phoneNumber:userDetail?.user.phoneNumber
      })
    }
  }

  const getData = async () => {
    try {
      const response = await getUserEntityGroup()
      if(Object.keys(response).length){
        setUserDetail(response)
      }
    } finally {
      setLoading(false)
    }
  }

  const closeInfoVisible = () => {
    setInfoVisible(false)
    infoForm.resetFields()

  }

  useEffect(()=>{
    getData()
  },[])
  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        {
          !loading ?
            <PullToRefresh onRefresh={getData}>
              <Card className={'mb-2'} style={{ '--adm-card-border-radius': 'var(--rounder-radius)' }} title={<span
                className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{t('base.baseInfo')}</span>}>
                <CardText label={t('personal.realName')} value={userDetail?.user.actualName}/>
                <CardText label={t('personal.username')} value={userDetail?.user.userName}/>
                <CardText label={t('base.emailAddress')} value={userDetail?.user.emailAddress}/>
                <CardText label={t('base.phoneNumber')} value={userDetail?.user.phoneNumber}/>
                <CardText label={t('order.createdTime')}
                          value={dayjs(userDetail?.user.createdTime).format('YYYY-MM-DD HH:mm')}/>
                <CardText label={t('order.updatedTime')}
                          value={dayjs(userDetail?.user.updatedTime).format('YYYY-MM-DD HH:mm')}/>
                <CardText label={t('personal.roles')} value={
                  <Space wrap style={{'--gap': '4px'}}>
                    {
                      userDetail?.roles?.map(role => <Tag color='success' key={role.id}>{role.name}</Tag>)
                    }
                  </Space>
                }/>
                <CardText label={t('group.department')} value={
                  <Space wrap style={{'--gap': '4px'}}>
                    {
                      userDetail?.departments?.map(department => <Tag color='warning'
                                                                      key={department.id}>{department.code}({department.name})</Tag>)
                    }
                  </Space>
                }/>
                <CardText label={t('group.company')} value={
                  <Space wrap style={{'--gap': '4px'}}>
                    {
                      userDetail?.branchs?.map(branch => <Tag color='#2db7f5' key={branch.id}>{branch.code}</Tag>)
                    }
                  </Space>
                } style={'items-start'}/>
                <Divider/>
                <Grid columns={2} gap={8}>
                  <Grid.Item>
                    <Button block size={'small'} color={'danger'}
                            onClick={() => renewInfo('password')}>{t('personal.changePassword')}</Button>
                  </Grid.Item>
                  <Grid.Item>
                    <Button block size={'small'} color={'warning'}
                            onClick={() => renewInfo('info')}>{t('group.renew')}</Button>
                  </Grid.Item>
                </Grid>
              </Card>
            </PullToRefresh> :
            <Loading/>
        }
      </div>
      <Popup visible={infoVisible} position='bottom' onMaskClick={closeInfoVisible} style={{minHeight: '80vh'}}>
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
