import {useState} from "react";
import {Input, Picker, Space} from "antd-mobile";
import {DownOutline} from "antd-mobile-icons";
import type {PickerValue} from "antd-mobile/es/components/picker-view";

const columns = [
  '93',
  '355',
  '213',
  '376',
  '244',
  '54',
  '374',
  '61',
  '43',
  '994',
  '1242',
  '973',
  '880',
  '375',
  '32',
  '501',
  '229',
  '975',
  '591',
  '387',
  '267',
  '55',
  '673',
  '359',
  '226',
  '855',
  '237',
  '1',
  '56',
  '86',
  '57',
  '506',
  '385',
  '53',
  '357',
  '420',
  '45',
  '1809',
  '593',
  '20',
  '372',
  '251',
  '358',
  '33',
  '49',
  '30',
  '852',
  '36',
  '354',
  '91',
  '62',
  '98',
  '964',
  '353',
  '972',
  '39',
  '1876',
  '81',
  '962',
  '7',
  '254',
  '965',
  '856',
  '371',
  '961',
  '370',
  '352',
  '60',
  '52',
  '31',
  '64',
  '234',
  '47',
  '92',
  '507',
  '51',
  '63',
  '48',
  '351',
  '974',
  '40',
  '966',
  '381',
  '65',
  '421',
  '386',
  '27',
  '82',
  '34',
  '94',
  '46',
  '41',
  '886',
  '66',
  '90',
  '380',
  '971',
  '44',
  '84',
  '263'
]

interface MobileFieldProps {
  value?: string
  onChange?: (value: string) => void
}
export default function MobileField({
                                      value = '86/',
                                      onChange,
                                    }: MobileFieldProps) {
  const [visible, setVisible] = useState(false)

  const [preValue = '86', realValue = ''] = value.split('/')

  const triggerValue = (changedValue: Partial<{ preValue: string | number; realValue: string }>) => {
    onChange?.(`${changedValue.preValue ?? preValue}/${changedValue.realValue ?? realValue}`)
  }

  const onRealValueChange = (value: string) => {
    triggerValue({realValue: value})
  }

  const onPreValueChange = (value: PickerValue[]) => {
    const v = value[0]
    if (v === null) return
    triggerValue({preValue: v})
  }

  return (
    <>
      <Space align='center'>
        <Space align='center' onClick={() => setVisible(true)}>
          <div>+{preValue}</div>
          <DownOutline/>
        </Space>
        <Input
          placeholder='请输入手机号'
          value={realValue}
          onChange={onRealValueChange}
        />
      </Space>
      <Picker
        columns={[columns]}
        visible={visible}
        onClose={() => {
          setVisible(false)
        }}
        value={[preValue]}
        onConfirm={onPreValueChange}
      />
    </>
  )
}
