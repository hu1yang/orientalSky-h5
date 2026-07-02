import {useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {useParams} from "react-router";

import {
  Button,
  Card,
  Checkbox, CheckList,
  Dialog,
  Divider, FloatingBubble,
  Form,
  Input,
  Loading,
  Popup,
  PullToRefresh, SearchBar,
  Space,
  Tag,
  Toast
} from "antd-mobile";
import {
  createAgentUser,
  deleteAgentUser, getAgentAuthorizableRouting,
  getAgentRoles,
  getAgentUserEntities, getGroupAgentAuthorizedRouting,
  updateAgentUserPassword, updateAgentUserRoutings
} from "@/utils/request/identity.ts";
import type {
  AgentUserForm,
  AssemblyData,
  AssemblyDataSubmitForm,
  Role,
  UserWithRoles
} from "@/types/identity.ts";
import CardText from "@/component/card/cardText.tsx";
import MobileField from "@/component/form/mobileField.tsx";
import {AddOutline} from "antd-mobile-icons";
import NoData from "@/component/default/noData.tsx";

type IPermissions = {userId:string;permissions:string[]}
type IPassword = {userId:string;newPassword:string}

export default function AgentUser (){
  const {agentId} = useParams();
  const {t} = useTranslation()

  const [loading, setLoading] = useState(true);
  const [agentUser, setAgentUser] = useState<UserWithRoles[]>([])

  const [roleValue, setRoleValue] = useState<Role[]>([])

  const [visible, setVisible] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [userType, setUserType] = useState<'default'|'password'|'permissions'>('default')

  const [routesValue, setRoutesValue] = useState<AssemblyData|null>(null)
  const [searchText, setSearchText] = useState('')

  const [userForm] = Form.useForm()


  const delUser = (id: string) => {
    Dialog.confirm({
      content: t('common.deleteConfirm'),
      onConfirm: async () => {
        try {
          const response = await deleteAgentUser(id)
          if (response.succeeded) {
            Toast.show({
              icon: 'success',
              content: t('common.deleteSuccess'),
            })
            getData()
          } else {
            Toast.show({
              icon: 'fail',
              content: `${response?.errors[0].code}: ${response?.errors[0].description}`,
            })
          }
        } catch {
          throw new Error()
        }
      },
    })
  }

  const getRole = () => {
    if(!roleValue.length){
      getAgentRoles().then(res => {
        setRoleValue([...res])
      })
    }
  }

  const closeUserVisible = () => {
    setVisible(false)
    userForm.resetFields()
    setButtonLoading(false)
    setSearchText('')
    setRoutesValue(null)
    setTimeout(() => {
      setUserType('default')
    },200)
  }

  const finishForm = async (val: AgentUserForm|IPassword|IPermissions) => {
    setButtonLoading(true)
    try {
      switch (userType) {
        case 'default': {
          const response = await createAgentUser(val as AgentUserForm)
          if(response.succeeded){
            Toast.show({
              icon: 'success',
              content: t('group.createSuccess'),
            })
            getData()
            closeUserVisible()
          }else{
            Toast.show({
              icon: 'fail',
              content: response.errors[0].description,
            })
          }
          break
        }
        case 'password': {
          const response = await updateAgentUserPassword(val as IPassword)
          if(response.succeeded){
            Toast.show({
              icon: 'success',
              content: t('common.operationSuccessful'),
            })
            getData()
            closeUserVisible()
          }else{
            Toast.show({
              icon: 'fail',
              content: response.errors[0].description,
            })
          }
          break
        }
        case 'permissions': {
          const form = val as IPermissions
          if (!routesValue) break
          const userRouteKeyInfos = routesValue.routeValidateKeys?.filter(a => form.permissions.includes(a.routeKey)) || []

          const submitForm: AssemblyDataSubmitForm = {
            assemblyName: routesValue.assemblyName,
            groupKey: routesValue.groupKey,
            userRouteKeyInfos
          }
          const response = await updateAgentUserRoutings(form.userId, [submitForm])
          if(response.succeeded){
            Toast.show({
              icon: 'success',
              content: t('common.operationSuccessful'),
            })
            getData()
            closeUserVisible()
          }else{
            Toast.show({
              icon: 'fail',
              content: response.errors[0].description,
            })
          }
          break
        }
      }

    } catch {
      throw new Error()
    } finally {
      setButtonLoading(false)
    }
  }

  const addUser = () => {
    setUserType('default')
    userForm.setFieldValue('agentId', agentId)
    getRole()
    setVisible(true)
  }

  const routesMap = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) return routesValue?.routeValidateKeys

    return routesValue?.routeValidateKeys.filter(routeValidateKey =>
      routeValidateKey.headerTitle?.toLowerCase().includes(keyword) ||
      routeValidateKey.description?.toLowerCase().includes(keyword)
    )

  }, [searchText, routesValue])

  const updateUserPass = (id: string) => {
    userForm.setFieldValue('userId', id)
    setUserType('password')
    setVisible(true)
  }

  const getRoutePermissions = async (id:string) => {
    const [routing, listed] = await Promise.all([
      getAgentAuthorizableRouting(),
      getGroupAgentAuthorizedRouting(id)
    ])
    setRoutesValue(routing)
    userForm.setFieldValue('permissions', listed.map(a => a.routeKey))
  }

  const updateUserPermissions = (id: string) => {
    getRoutePermissions(id)
    userForm.setFieldValue('userId', id)
    setUserType('permissions')
    setVisible(true)
  }

  const rederTitle = useMemo(() => {
    switch (userType) {
      case 'default':
        return t('group.userAdd');
      case 'password':
        return t('group.updatePassword');
      case 'permissions':
        return t('group.updatePermissions');
      default:
        return '';
    }
  },[userType])

  const renderFormFiled = () => {
    switch (userType) {
      case 'default':
        return (
          <>
            <Form.Item name={'agentId'} hidden />
            <Form.Item label={t('group.realName')} name={'actualName'} rules={[
              {required: true, message: t('group.realName')},
            ]}>
              <Input placeholder={t('group.realName')} />
            </Form.Item>
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
            <Form.Item label={t('group.userName')} name={'userName'} rules={[
              {required: true, message: t('group.userName')},
            ]}>
              <Input placeholder={t('group.userName')} />
            </Form.Item>
            <Form.Item label={t('group.loginPassword')} name={'password'} rules={[
              {required: true, message: t('group.loginPassword')},
            ]}>
              <Input placeholder={t('group.loginPassword')} type={'password'} />
            </Form.Item>
            <Form.Item label={t('group.role')} name={'roleIds'}>
              <Checkbox.Group>
                <Space direction='horizontal' wrap>
                  {
                    roleValue.map(role => (
                      <Checkbox value={role.id} key={role.id}>{role.name}</Checkbox>
                    ))
                  }
                </Space>
              </Checkbox.Group>
            </Form.Item>
          </>
        );
      case 'password':
        return (
          <>
            <Form.Item name={'userId'} hidden />
            <Form.Item label={t('group.newPassword')} name={'newPassword'} rules={[
              { required: true, message: t('personal.newPasswordRequired') },
            ]}>
              <Input placeholder={t('group.newPassword')} type={'password'} />
            </Form.Item>
          </>
        );
      case 'permissions':
        return (
          <>
            <Form.Item name={'userId'} hidden />
            <Form.Item name={'permissions'} style={{
              '--padding-left': '0',
              '--padding-right': '0',
            }}>
              <CheckList multiple style={{padding: 0}}>
                <SearchBar
                  className={'mt-2 mx-2'}
                  placeholder={t('common.search')}
                  value={searchText}
                  onChange={setSearchText}
                />
                <div className={'w-full py-3 px-1'} key={routesValue?.groupKey}>
                  <h2
                    className={'mb-2 text-center'}>{routesValue?.assemblyName.includes('Identity') ? t('group.identityPermissions') : t('group.groupPermissions')}</h2>
                  <div className={'h-[250px] overflow-auto'}>
                    {
                      routesMap?.length ?
                        routesMap?.map(routeValidateKey => (
                          <CheckList.Item key={routeValidateKey.routeKey}
                                          value={routeValidateKey.routeKey}>
                            {t('management.'+routeValidateKey.methodName)}-{t('management.'+routeValidateKey.className)}
                          </CheckList.Item>
                        ))
                        :
                        <NoData/>
                    }
                  </div>
                </div>
              </CheckList>
            </Form.Item>
          </>
        );
    }
  }

  const getData = async () => {
    try {
      const result = await getAgentUserEntities(agentId as string);
      setAgentUser(result)
    } finally {
      setLoading(false)
    }
  }

  useEffect(()=>{
    if(agentId){
      getData()
    }
  },[agentId])
  return (
    <section className={'containerMain'}>
      <div className={'p-2'}>
        {
          !loading ?
            <PullToRefresh onRefresh={getData}>
              {
                agentUser.map((item) => (
                  <Card className={'mb-2'} title={<span
                    className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.user.userName}</span>}
                        extra={<Tag round
                                    color={item.user.isLocked ? 'danger' : 'success'}> {!item.user.isLocked ? t('base.enabled') : t('base.disabled')}</Tag>}
                        key={item.user.id}>
                    <CardText label={t('group.realName')} value={item.user.actualName}
                              valueStyle={'text-[1.2rem] font-bold'}/>
                    <CardText label={t('group.phoneNumber')} value={item.user.phoneNumber}/>
                    <CardText label={t('group.emailAddress')} value={item.user.emailAddress}/>
                    <CardText label={t('group.role')} value={
                      <Space wrap style={{'--gap': '4px'}}>
                        {
                          item?.roles?.map(role => <Tag color='#87d068' key={role.id}>{role.name}</Tag>)
                        }
                      </Space>
                    } style={'items-start'}/>
                    <Divider/>
                    <Space justify={'end'} className={'w-full'}>
                      <Button size={'small'} color={'danger'}
                              onClick={() => delUser(item.user.id)}>{t('common.delete')}</Button>
                      <Button size={'small'} color={'warning'}
                              onClick={() => updateUserPass(item.user.id)}>{t('group.updatePassword')}</Button>
                      <Button size={'small'} color={'primary'}
                              onClick={() => updateUserPermissions(item.user.id)}>{t('group.updatePermissions')}</Button>
                    </Space>
                  </Card>
                ))
              }
            </PullToRefresh>
            :
            <Loading />
        }
      </div>
      <Popup visible={visible} destroyOnClose position='bottom' onMaskClick={closeUserVisible}>
        <Form form={userForm} layout='vertical' onFinish={finishForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          <div className={'p-3 my-2 text-center'}>
            <span className={'text-[1.4rem] mb-20'}>{rederTitle}</span>
          </div>
          {renderFormFiled()}
        </Form>
      </Popup>
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={addUser}>
        <AddOutline fontSize={22}/>
      </FloatingBubble>
    </section>
  )
}
