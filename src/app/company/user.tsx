import {useEffect, useMemo, useRef, useState} from "react";
import {useParams} from "react-router";
import {useSelector} from "react-redux";
import type {RootState} from "@/store";

import {useTranslation} from "react-i18next";
import {
  Button,
  Card, Checkbox, CheckList, Dialog,
  Divider, FloatingBubble,
  Form, Input,
  Loading,
  Popover,
  Popup,
  PullToRefresh,
  Radio,
  SearchBar,
  Selector,
  Space,
  Tag,
  Toast
} from "antd-mobile";
import {
  createUser,
  deleteUser,
  getAuthorizableRouting, getAuthorizedRouting,
  getDepartments, getLoginInfos,
  getPermissionRoles,
  getUserEntitiesGroup, updatePassword,
  updateUserBranchs, updateUserDepartments,
  updateUserRoles, updateUserRoutings,
} from "@/utils/request/identity.ts";
import type {AssemblyDataForm, Department, Role, UserLogInfo, UserResponse} from "@/types/identity.ts";
import CardText from "@/component/card/cardText.tsx";
import {getAuthorizableRoutingGroup} from "@/utils/request/group.ts";
import NoData from "@/component/default/noData.tsx";
import LogLogin from "@/component/default/logLogin.tsx";
import MobileField from "@/component/form/mobileField.tsx";
import {AddOutline} from "antd-mobile-icons";

export default function User() {
  const {branchId} = useParams()
  const {t} = useTranslation()
  const {branchAgents,branchMore} = useSelector((state: RootState) => state.baseInfo);

  const [keyword, setKeyword] = useState('')
  const [loading, setLoading] = useState(true)

  const [userData, setUserData] = useState<UserResponse[]>([])
  const [searchFormData, setSearchFormData] = useState({
    branchId: branchId ?? '',
    userName: '',
    emailAddress: '',
    roleId: '',
    departmentId: '',
    phoneNumber: ''
  })
  const [searchForm] = Form.useForm()
  const [userVisible, setUserVisible] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [typeForm, setTypeForm] = useState<'role' | 'branch' | 'department' | 'permissions' | 'password'>('role')
  const [roleValue, setRoleValue] = useState<Role[]>([])
  const [departmentValue, setDepartmentValue] = useState<Department[]>([])
  const [routesValue, setRoutesValue] = useState<AssemblyDataForm[]>([])
  const [searchText, setSearchText] = useState('')
  const [userForm] = Form.useForm()

  const logRef = useRef<{
    showLog: (logList: UserLogInfo[]) => void
  } | null>(null);


  const [userAddVisible, setUserAddVisible] = useState(false)
  const [companyAddForm] = Form.useForm();

  const closeUserAddVisible = () => {
    setUserAddVisible(false)
    setButtonLoading(false)
    companyAddForm.resetFields()
  }

  const finishAddForm = async (val) => {
    const form = {
      ...val,
      branchIds: [val.branchIds],
    }
    setButtonLoading(true)
    try {
      const response = await createUser(form)
      if (response.succeeded) {
        Toast.show({
          icon: 'success',
          content: t('group.createSuccess'),
        })
        closeUserAddVisible()
        getData()
      } else {
        Toast.show({
          icon: 'fail',
          content: response.errors[0].description,
        })
      }
    } finally {
      setUserAddVisible(false)
    }
  }

  const addUser = () => {
    if (branchId) {
      getDepartmentValue(branchId)
    }
    companyAddForm.setFieldValue('branchIds', branchId)
    getRoleValue()
    setUserAddVisible(true)
  }

  const getlog = (id: string) => {
    getLoginInfos(id, 0, 50).then(res => {
      if (res.length) {
        if (logRef) {
          logRef.current?.showLog(res)
        }
      } else {
        Toast.show({
          content: 'No Data',
        })
      }
    })
  }

  const routesMap = useMemo(() => {
    const keyword = searchText.trim().toLowerCase()

    if (!keyword) return routesValue

    return routesValue.map(routes => ({
      ...routes,
      routeValidateKeys: routes.routeValidateKeys.filter(routeValidateKey =>
        routeValidateKey.headerTitle?.toLowerCase().includes(keyword) ||
        routeValidateKey.description?.toLowerCase().includes(keyword)
      )
    }))
  }, [searchText, routesValue])

  const getRoleValue = async () => {
    if (roleValue.length) return
    const response = await getPermissionRoles()
    setRoleValue(response)
  }

  const getDepartmentValue = async (id: string) => {
    if (departmentValue.length && branchId) return
    const response = await getDepartments(id)
    if(response.length){
      setDepartmentValue(response)
    }else{
      closeUserVisible()
    }
  }

  const getRoutePermissions = async (id: string) => {
    const [routing, groupListed, listed] = await Promise.all([
      getAuthorizableRouting(),
      getAuthorizableRoutingGroup(),
      getAuthorizedRouting(id as string)
    ])
    setRoutesValue([
      routing,
      groupListed
    ])
    userForm.setFieldValue('permissions', listed.map(a => a.routeKey))
  }

  const renderFormFiled = () => {
    switch (typeForm) {
      case 'role':
        return (
          <Form.Item label={t('group.updateRole')} name={'newRoleIds'} rules={[
            {required: true, message: t('group.updateRole')},
          ]}>
            <Selector
              columns={3}
              multiple
              fieldNames={{label: 'name', value: 'id'}}
              options={roleValue}
            />
          </Form.Item>
        )
      case 'branch':
        return (
          <Form.Item label={t('group.updateCompany')} name={'newBranchIds'} rules={[
            {required: true, message: t('group.updateCompany')},
          ]}>
            <Selector
              columns={3}
              multiple
              options={branchMore.map(item => ({
                label: item.code,
                value: item.id,
              }))}
            />
          </Form.Item>
        )
      case 'department':
        return (
          <>
            {
              !branchId && (
                <Form.Item label={t('group.updateCompany')} name={'newBranchIds'} rules={[
                  {required: true, message: t('group.updateCompany')},
                ]}>
                  <Selector
                    columns={3}
                    multiple
                    options={branchMore.map(item => ({
                      label: item.code,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              )
            }
            {
              !!departmentValue.length && (
                <Form.Item label={t('group.updateDepartment')} name={'newDepartmentIds'} rules={[
                  {required: true, message: t('group.updateDepartment')},
                ]}>
                  <Selector
                    columns={3}
                    multiple
                    options={departmentValue.map(item => ({
                      label: item.name,
                      value: item.id,
                    }))}
                  />
                </Form.Item>
              )
            }
          </>
        )
      case 'permissions':
        return (
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
              {
                routesMap.map(routes => (
                  <div className={'w-full py-3 px-1'} key={routes.groupKey}>
                    <h2
                      className={'mb-2 text-center'}>{routes.assemblyName.includes('Identity') ? t('group.identityPermissions') : t('group.groupPermissions')}</h2>
                    <div className={'h-[250px] overflow-auto'}>
                      {
                        routes.routeValidateKeys.length ?
                          routes.routeValidateKeys.map(routeValidateKey => (
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
                ))
              }
            </CheckList>
          </Form.Item>
        )
        break
      case 'password':
        return (
          <>
            <h4 className={'text-center my-4'}>{t('group.updatePassword')}</h4>
            <Form.Item label={t('group.newPassword')} name={'newPassword'} rules={[
              {required: true, message: t('group.newPassword')},
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/,
                message: t('login.enterPassWordTip')
              },
            ]}>
              <Input placeholder={t('group.newPassword')} type={'password'}/>
            </Form.Item>
          </>
        )
    }
  }

  const finishForm = async (val) => {
    setButtonLoading(true)
    try {
      const form = {
        ...val,
        userId: userForm.getFieldValue('userId')
      }
      let response
      switch (typeForm) {
        case 'role':
          response = await updateUserRoles(form)
          break
        case 'branch':
          response = await updateUserBranchs(form)
          break
        case 'department':
          response = await updateUserDepartments(form)
          break
        case 'permissions': {
          const formV = routesValue.map(routes => {
            return {
              assemblyName: routes.assemblyName,
              groupKey: routes.groupKey,
              userRouteKeyInfos: routes.routeValidateKeys.filter(a => form.permissions.includes(a.routeKey))
            }
          })
          response = await updateUserRoutings(form.userId, formV)
          break
        }
        case 'password':
          response = await updatePassword(form)
          break
      }
      if (response?.succeeded) {
        Toast.show({
          icon: 'success',
          content: t('common.operationSuccessful'),
        })
        closeUserVisible()
        getData()
      } else {
        Toast.show({
          icon: 'fail',
          content: `${response?.errors[0].code}: ${response?.errors[0].description}`,
        })
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const updateUser = (item: UserResponse, type: 'role' | 'branch' | 'department' | 'permissions' | 'password') => {
    setTypeForm(type)
    userForm.setFieldValue('userId', item.user.id)
    switch (type) {
      case 'role':
        userForm.setFieldsValue({
          newRoleIds: item.roles.map(a => a.id)
        })
        getRoleValue()
        break
      case 'branch':
        userForm.setFieldsValue({
          newBranchIds: item.branchs?.map(a => a.id)
        })
        break
      case 'department':
        userForm.setFieldsValue({
          newDepartmentIds: item.departments?.map(a => a.id)
        })
        if (branchId) {
          getDepartmentValue(branchId)
        }
        break
      case 'permissions':
        userForm.setFieldsValue({
          userId: item.user.id,
        })
        getRoutePermissions(item.user.id)
        break
    }

    setUserVisible(true)
  }

  const closeUserVisible = () => {
    setUserVisible(false)
    setSearchText('')
    setRoutesValue([])
    setButtonLoading(false)
    setTypeForm('role')
    userForm.resetFields()
  }

  const delUser = (id: string) => {
    Dialog.confirm({
      content: t('common.deleteConfirm'),
      onConfirm: async () => {
        try {
          const response = await deleteUser(id)
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

  const searchFilter = (val: string) => {
    setSearchFormData(prev => ({
      ...prev,
      userName: val
    }))
  }

  const getData = async () => {
    const response = await getUserEntitiesGroup(searchFormData)
    if (response.count > 0) {
      setUserData(response.items)
    }
    setLoading(false)
  }

  useEffect(() => {
    const init = () => {
      getData()
    }
    init()
  }, [searchFormData])
  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('group.userName')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} value={keyword} onChange={setKeyword}
                   onSearch={searchFilter} onClear={() => searchFilter('')}/>
      </div>
      <div className={'p-2'}>
        {
          !loading ?
            <PullToRefresh onRefresh={getData}>
              {
                userData.map(item => (
                  <Card className={'mb-2'} title={<span
                    className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.user.userName}</span>}
                        extra={<Tag round
                                    color={item.user.isLocked ? 'danger' : 'success'}> {!item.user.isLocked ? t('base.enabled') : t('base.disabled')}</Tag>}
                        key={item.user.id}>
                    <CardText label={t('group.realName')} value={item.user.actualName}
                              valueStyle={'text-[1.2rem] font-bold'}/>
                    <CardText label={t('group.phoneNumber')} value={item.user.phoneNumber}/>
                    <CardText label={t('group.emailAddress')} value={item.user.emailAddress}/>
                    <CardText label={t('group.company')} value={
                      <Space wrap style={{'--gap': '4px'}}>
                        {
                          item?.branchs?.map(branch => <Tag color={
                            branchId === branch.id ? 'danger' : '#2db7f5'
                          } key={branch.id}>{branch.code}</Tag>)
                        }
                      </Space>
                    } style={'items-start'}/>
                    <CardText label={t('group.role')} value={
                      <Space wrap style={{'--gap': '4px'}}>
                        {
                          item?.roles?.map(role => <Tag color='#87d068' key={role.id}>{role.name}</Tag>)
                        }
                      </Space>
                    } style={'items-start'}/>
                    <CardText label={t('group.department')} value={
                      <Space wrap style={{'--gap': '4px'}}>
                        {
                          item?.departments?.map(department => <Tag color='#108ee9'
                                                                    key={department.id}>{department.name}</Tag>)
                        }
                      </Space>
                    } style={'items-start'}/>
                    <Divider/>
                    <Space justify={'end'} className={'w-full'}>
                      <Button size={'small'} color={'danger'}
                              onClick={() => delUser(item.user.id)}>{t('common.delete')}</Button>
                      <Button color='default' size='small' onClick={() => getlog(item.user.id)}>
                        {t('common.routerLog')}
                      </Button>
                      <Popover.Menu
                        actions={[
                          {key: 'branch', text: t('group.updateCompany'), onClick: () => updateUser(item, 'branch')},
                          {key: 'role', text: t('group.updateRole'), onClick: () => updateUser(item, 'role')},
                          {
                            key: 'department',
                            text: t('group.updateDepartment'),
                            onClick: () => updateUser(item, 'department')
                          },
                          {
                            key: 'permissions',
                            text: t('group.updatePermissions'),
                            onClick: () => updateUser(item, 'permissions')
                          },
                          {
                            key: 'password',
                            text: t('group.updatePassword'),
                            onClick: () => updateUser(item, 'password')
                          },
                        ]}
                        placement='bottom'
                        trigger='click'>
                        <Button size={'small'} color={'warning'} block>{t('personal.updateUserInfo')}</Button>
                      </Popover.Menu>
                    </Space>
                  </Card>
                ))
              }
            </PullToRefresh>
            :
            <Loading/>
        }
      </div>
      <Popup visible={userVisible} destroyOnClose position='bottom' onMaskClick={closeUserVisible}>
        <Form form={userForm} layout='vertical' onFinish={finishForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          {renderFormFiled()}
        </Form>
      </Popup>
      <Popup visible={userAddVisible} destroyOnClose position='bottom' onMaskClick={closeUserAddVisible}>
        <div className={'p-3 my-2 text-center'}>
          <span className={'text-[1.4rem] mb-20'}>{t('group.userAdd')}</span>
        </div>
        <Form form={companyAddForm} layout='vertical' onFinish={finishAddForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          <div className={'h-[60vh] overflow-y-auto'}>
            <Form.Item label={t('group.realName')} name={'actualName'} rules={[
              {required: true, message: t('group.realName')},
            ]}>
              <Input placeholder={t('group.realName')}/>
            </Form.Item>
            <Form.Item label={t('base.emailAddress')} name={'emailAddress'} rules={[
              {required: true, message: t('group.emailRequired')},
              {type: 'email', warningOnly: true, message: t('group.emailInvalid')},
            ]}>
              <Input placeholder={t('group.emailRequired')}/>
            </Form.Item>
            <Form.Item label={t('base.phoneNumber')} name={'phoneNumber'} rules={[
              {required: true, message: t('base.phoneNumber')},
            ]}>
              <MobileField/>
            </Form.Item>
            <Form.Item label={t('group.loginName')} name={'userName'} rules={[
              {required: true, message: t('group.loginName')},
            ]}>
              <Input placeholder={t('group.loginName')}/>
            </Form.Item>
            <Form.Item label={t('group.loginPassword')} name={'password'} rules={[
              {required: true, message: t('group.loginPassword')},
              {
                pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/,
                message: t('login.enterPassWordTip')
              },
            ]}>
              <Input placeholder={t('group.loginPassword')} type={'password'}/>
            </Form.Item>
            <Form.Item label={t('group.company')} name={'branchIds'} rules={[
              {required: true, message: t('group.company')},
            ]}>
              <Radio.Group disabled={!!branchId}>
                <Space direction='horizontal' wrap>
                  {
                    branchAgents.map(ba => (
                      <Radio value={ba.branch.id} key={ba.branch.id}>{ba.branch.code}</Radio>
                    ))
                  }
                </Space>
              </Radio.Group>
            </Form.Item>
            <Form.Item label={t('group.department')} name={'departmentIds'}>
              <Checkbox.Group>
                <Space direction='horizontal' wrap>
                  {
                    departmentValue.map(department => (
                      <Checkbox value={department.id} key={department.id}>{department.name}</Checkbox>
                    ))
                  }
                </Space>
              </Checkbox.Group>
            </Form.Item>
            <Form.Item label={t('group.role')} name={'roleIds'} rules={[
              {required: true, message: t('group.role')},
            ]}>
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
          </div>

        </Form>

      </Popup>
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={addUser}>
        <AddOutline fontSize={22}/>
      </FloatingBubble>
      <LogLogin ref={logRef}/>
    </section>
  )
}
