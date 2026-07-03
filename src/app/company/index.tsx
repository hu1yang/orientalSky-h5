import {useEffect, useMemo, useState} from "react";
import {useNavigate} from "react-router";
import {useTranslation} from "react-i18next";
import {useDispatch, useSelector} from "react-redux";
import {setBranchMore} from "@/store/modules/base.ts";
import type {RootState} from "@/store";

import {
  Button,
  Card,
  Divider,
  FloatingBubble,
  Form,
  Input,
  Loading, Picker,
  Popup,
  PullToRefresh, SearchBar,
  Space,
  TextArea, Toast
} from "antd-mobile";

import {createBranchGroup, getGroupBranchs, updateBranchGroup} from "@/utils/request/identity.ts";
import type {GroupBranch} from "@/types/identity.ts";
import CardText from "@/component/card/cardText.tsx";
import {AddOutline} from "antd-mobile-icons";

import countryArr from "@/assets/country.json"
import type {IBranch} from "@/types/group.ts";


type ICompany = GroupBranch & {
  authorization?:boolean;
  agentLength?:number|string
}
export default function Company() {
  const navigate = useNavigate();

  const [keyword, setKeyword] = useState('')

  const {t} = useTranslation();
  const dispatch = useDispatch()
  const {branchAgents} = useSelector((state: RootState) => state.baseInfo);

  const [loading, setLoading] = useState(true)
  const [branchs, setBranchs] = useState<ICompany[]>([])

  const [companyVisible, setCompanyVisible] = useState(false)
  const [buttonLoading, setButtonLoading] = useState(false)
  const [companyForm] = Form.useForm();
  const branchIdCompanyForm = Form.useWatch('branchId',companyForm)
  const countryNameCompanyForm = Form.useWatch('countryName',companyForm)

  const closeCompanyVisible = () => {
    setCompanyVisible(false)
    companyForm.resetFields()
  }

  const finishForm = async (val: IBranch) => {
    setButtonLoading(true)
    try {
      let response
      if(val.branchId){
        response = await updateBranchGroup(val)
      }else{
        response = await createBranchGroup(val)
      }
      if(response.succeeded){
        Toast.show({
          icon: 'success',
          content: t('common.operationSuccessful'),
        })
        getData()
        closeCompanyVisible()
      }else{
        Toast.show({
          icon: 'fail',
          content: `${response.errors[0].code}: ${response.errors[0].description}`,
        })
      }
    } finally {
      setButtonLoading(false)
    }
  }

  const updateBranch = (branch: ICompany) => {
    const country = countryArr.find(country => country.countryCode === branch.country)
    companyForm.setFieldsValue({
      branchId: branch.id,
      code:branch.code,
      name: branch.name,
      otherName: branch.otherName,
      localAddress: branch.localAddress,
      country: branch.country,
      countryName: `${country?.countryEName}(${country?.countryCName})`,
      description: branch.description ,
    })
    setCompanyVisible(true)
  }

  const getData = async () => {
    try {
      const response = await getGroupBranchs()
      dispatch(setBranchMore(response))
      const newRes = response.map(item => {
        const branch = branchAgents.find(ba => ba.branch.id === item.id)
        return {
          ...item,
          agentLength: branch ? branch.agents.length : '--',
          ...(branch ? { authorization: true } : {})
        };
      });
      setBranchs(newRes)
    } finally {
      setLoading(false)
    }
  }

  const branchsMemo = useMemo(() => {
    const lowerKeyword = keyword.toLowerCase();
    return branchs.filter(item => {
      return item.name ? item.name.toLowerCase().includes(lowerKeyword) : false;
    });
  }, [keyword, branchs]);

  useEffect(() => {
    getData()
  },[])
  return (
    <section className={'containerMain'}>
      <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
        <SearchBar className={'flex-1'} placeholder={t('group.companyName')}
                   style={{'--background': '#e8e9ed', '--border-radius': '20px'}} onSearch={setKeyword} onClear={() => setKeyword('')} />
      </div>
      <div className={'p-2'}>
        <PullToRefresh onRefresh={getData}>
          {
            !loading ?
              branchsMemo.map((branch) => (
                <Card className={'mb-2'} style={{ '--adm-card-border-radius': 'var(--rounder-radius)' }}  key={branch.id}
                      title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{branch.name}</span>}>
                  <CardText label={t('group.companyCode')} value={branch.code} />
                  <CardText label={t('group.companyAddress')} value={branch.localAddress} />
                  <CardText label={t('group.companyNamelocal')} value={branch.otherName} />
                  <CardText label={t('airport.cityCode')} value={branch.country} />
                  <CardText label={t('base.remarks')}
                            value={branch.description}
                            labelStyle={'!w-30'} style={'!items-start'} valueStyle={'!text-(--text)'} />
                  <Divider />
                  <Space justify={'end'} className={'w-full'}>
                    <Button size={'small'} disabled={!branch.authorization} color={'primary'} onClick={() => updateBranch(branch)}>{t('group.updateBranch')}</Button>
                    <Button size={'small'} disabled={!branch.authorization} color={'success'} onClick={() => navigate(`/group/user/${branch.id}`)}>{t('common.routerUserManagement')}</Button>
                    <Button size={'small'} disabled={!branch.authorization} color={'warning'} onClick={() => navigate(`/group/agent/${branch.id}`)}>{t('common.routerAgency')}</Button>
                  </Space>
                </Card>
              ))
              :
              <Loading />
          }
        </PullToRefresh>
      </div>
      <FloatingBubble style={{
        '--initial-position-bottom': '24px',
        '--initial-position-right': '24px',
        '--edge-distance': '24px',
      }} onClick={() => setCompanyVisible(true)}>
        <AddOutline fontSize={22} />
      </FloatingBubble>
      <Popup visible={companyVisible} destroyOnClose position='bottom' onMaskClick={closeCompanyVisible}>
        <div className={'p-3 my-2 text-center'}>
          {
            companyVisible && (
              <span className={'text-[1.4rem] mb-20'}>{
                branchIdCompanyForm ? t('group.updateBranch') : t('group.createBranch')
              }</span>
            )
          }
        </div>
        <Form form={companyForm} layout='vertical' onFinish={finishForm} footer={
          <Button block type='submit' color='primary' size='middle' loading={buttonLoading}>
            {t('common.submit')}
          </Button>
        }>
          <Form.Item hidden name={'branchId'} />
          <Form.Item hidden name={'countryName'} />
          <Form.Item label={t('group.companyCode')} name={'code'} rules={[
            { required: true, message: t('group.companyCode') },
          ]}>
            <Input placeholder={t('group.companyCode')} />
          </Form.Item>
          <Form.Item label={t('group.companyName')} name={'name'} rules={[
            { required: true, message: t('group.companyName') },
          ]}>
            <Input placeholder={t('group.companyName')} />
          </Form.Item>
          <Form.Item label={t('group.companyNamelocal')} name={'otherName'}>
            <Input placeholder={t('group.companyNamelocal')} />
          </Form.Item>
          <Form.Item label={t('group.companyAddress')} name={'localAddress'}>
            <Input placeholder={t('group.companyAddress')} />
          </Form.Item>
          <Picker
            columns={[countryArr.map(country => ({
              value: country.countryCode,
              label: `${country.countryEName}(${country.countryCName})`
            }))]}
            onConfirm={(val,extend) => {
              companyForm.setFieldsValue({
                country: String(val[0]),
                countryName: extend.items[0]?.label
              })
            }}
          >
            {(_, actions) => (
              <Form.Item
                label={t('airport.countryCode')}
                name="country"
                onClick={actions.open}
                rules={[
                  { required: true, message: t('airport.countryCode') },
                ]}
              >
                <div onClick={actions.open}>
                  {countryNameCompanyForm || t('airport.countryCode')}
                </div>
              </Form.Item>
            )}
          </Picker>
          <Form.Item label={t('foundation.description')} name={'description'}>
            <TextArea placeholder={t('foundation.description')} />
          </Form.Item>
        </Form>
      </Popup>

    </section>
  )
}
