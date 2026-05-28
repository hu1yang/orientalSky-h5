import {useNavigate} from "react-router";
import {useDispatch} from "react-redux";
import {useTranslation} from "react-i18next";
import {Button, Form, Input, Toast} from "antd-mobile";

import logo from "@/assets/picture/blueLogo.png"
import {useEffect, useState} from "react";
import {generateCompanyCode} from "@/utils/public.ts";
import {getCaptcha, userSignin} from "@/utils/request/identity.ts";
import {setLogin} from "@/store/modules/tool.ts";
import Cookie from "js-cookie";

export default function Login(){
  const navigate = useNavigate();
  const {t} = useTranslation();
  const [loginForm] = Form.useForm();


  const [catchaImg, setCatchaImg] = useState<string|null>(null)
  const [loadingBtn, setLoadingBtn] = useState(false)

  const dispatch = useDispatch()


  const getCaptchaFnc = () => {
    const captchaId = generateCompanyCode()
    loginForm.setFieldsValue({
      captchaId
    })

    getCaptcha(captchaId).then(res => {
      const blob = new Blob([res])
      setCatchaImg(String(URL.createObjectURL(blob)))
    })
  }

  const finishForm = async (val) => {
    try {
      setLoadingBtn(true)
      const captchaId = loginForm.getFieldValue('captchaId')
      const formData = {
        captchaId,
        ...val
      }
      const response = await userSignin(formData)
      if(response.succeeded && response.principal){
        // toolStore.setLogin(response.principal)
        dispatch(setLogin(response.principal))

        Toast.show({
          icon: 'success',
          content: t('common.loginSuccessful'),
        })
        toHome()
      }else{
        if(response.errors){
          Toast.show({
            icon: 'fail',
            content: `${response.errors[0].code}: ${response.errors[0].description}`,
          })
        }
      }
    } finally {
      setLoadingBtn(false)
    }
  }

  const toHome = () => {
    navigate('/')
  }

  useEffect(() => {
    const token = Cookie.get('token')
    if(token){
      toHome()
    }else{
      getCaptchaFnc()
    }
  },[])

  return (
    <div className={'w-full h-[100vh]'}>
      <div className={'bg-[url("@/assets/picture/loginback.jpg")] bg-no-repeat bg-cover bg-center w-full h-full fixed top-0 left-0'}></div>
      <div className={'w-full h-full relative'}>
        <div className={'absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[90%] py-10 px-0 bg-[#0202021a] rounded-(--rounder-radius) backdrop-sepia-[blur(10px)]'}>
          <div className={'w-[230px] h-[41px] mx-auto mb-8'}>
            <img src={logo} alt=""/>
          </div>
          <Form form={loginForm} mode={'card'} className={'backdrop-sepia-[blur(10px)]'} onFinish={finishForm} style={{
            '--adm-color-background': 'transparent',
            '--adm-color-light':'#fff',
            '--border-top': '0',
            '--border-bottom': '0',
            '--border-inner': '0',
          }} footer={
            <Button block type='submit' color='primary' size='middle' loading={loadingBtn}>
              {t('login.login')}
            </Button>
          }>

            <Form.Item name={'userName'} rules={[
              {required: true, message: t('login.enterUserName')},
            ]}>
              <Input className='bg-transparent text-white' placeholder={t('login.enterUserName')} />
            </Form.Item>
            <Form.Item name={'password'} rules={[
              {required: true, message: t('login.enterPassWord')},
              { pattern: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^a-zA-Z\d\s]).{8,32}$/, message: t('login.enterPassWordTip') },
            ]}>
              <Input className='bg-transparent text-white' placeholder={t('login.enterPassWord')} type={'password'} />
            </Form.Item>
            <Form.Item name={'captchaCode'} extra={
              <div className={''} onClick={getCaptchaFnc}>
                {
                  !!catchaImg && <img src={catchaImg}/>
                }
              </div>
            }>
              <Input className='bg-transparent text-white' placeholder={t('login.enterCode')}/>
            </Form.Item>
          </Form>
        </div>
      </div>
    </div>
  )
}
