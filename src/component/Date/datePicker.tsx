import {memo, useState} from "react";
import {CalendarOutline} from "antd-mobile-icons";
import {CalendarPickerView, Popup} from "antd-mobile";
import dayjs from "dayjs"

const nowDate = dayjs().toDate()
const oneYearAgo = dayjs().subtract(1, 'year').toDate()
function DatePicker({selectionModeValue = 'single', value, changeDate}: {
  selectionModeValue?: 'single' | 'range';
  value: Date|[Date, Date];
  changeDate: (data: Date | [Date, Date]) => void
}) {
  const [datePicker, setDatePicker] = useState(false)
  const changePickerDate = (date: Date | [Date, Date] | null) => {
    if(selectionModeValue === 'single'){
      setDatePicker(false)
    }else{
      if((date as Date[])[0] !== (date as Date[])[1]){
        setDatePicker(false)
      }
    }
    if (date && date instanceof Date) {
      changeDate(date)
    }
  }
  return (
    <>
      <div className={'flex items-center border border-(--border) py-1 px-3 rounded-[5px]'} onClick={(event) => {
        event.preventDefault()
        setDatePicker(true)
      }}>
        <CalendarOutline fontSize={16} color={'var(--text)'}/>
        <span className={'ml-3 text-[1.2rem] text-(--text)'}>{
          selectionModeValue === 'single'?dayjs(value as Date).format('YYYY-MM-DD'):`${dayjs((value as Date[])[0]).format('YYYY-MM-DD')} - ${dayjs((value as Date[])[1]).format('YYYY-MM-DD')}`
        }</span>
      </div>
      <Popup visible={datePicker} style={{
        '--z-index':'9999999',
      }} onMaskClick={() => {
        setDatePicker(false)
      }}
             bodyStyle={{height: '60vh'}}>
        <CalendarPickerView selectionMode={selectionModeValue} max={nowDate} min={oneYearAgo}
                            onChange={changePickerDate}/>
      </Popup>
    </>
  )
}

export default memo(DatePicker)
