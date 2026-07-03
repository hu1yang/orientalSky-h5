import { memo, useRef, useState } from "react";
import { CalendarOutline } from "antd-mobile-icons";
import { CalendarPickerView, type CalendarPickerViewRef, Popup } from "antd-mobile";
import dayjs from "dayjs";

const nowDate = dayjs().toDate();
const oneYearAgo = dayjs().subtract(1, 'year').toDate();

interface DatePickerProps {
  selectionModeValue?: 'single' | 'range';
  value: Date | [Date, Date];
  changeDate: (data: Date | [Date, Date]) => void;
}

function DatePicker({ selectionModeValue = 'single', value, changeDate }: DatePickerProps) {
  const [datePicker, setDatePicker] = useState(false);
  const dateRef = useRef<CalendarPickerViewRef | null>(null);

  const changePickerDate = (date: Date | [Date, Date] | null) => {
    if (!date) return;

    if (selectionModeValue === 'single') {
      if (date instanceof Date) {
        setDatePicker(false);
        changeDate(date);
      }
    } else {
      const range = date as [Date, Date];

      // 💡 修复点：不管是不是点完了范围，都要把最新的选中状态通知给父级，否则页面会“卡死”
      changeDate(range);

      // 💡 只有当用户点完了不同的两个日期（起点和终点就绪），才关闭弹窗
      if (range[0] && range[1] && range[0].getTime() !== range[1].getTime()) {
        setDatePicker(false);
      }
    }
  };

  const renderDateText = () => {
    if (selectionModeValue === 'single') {
      return dayjs(value as Date).format('YYYY-MM-DD');
    }
    const range = value as [Date, Date];
    return `${dayjs(range[0]).format('YYYY-MM-DD')} - ${dayjs(range[1]).format('YYYY-MM-DD')}`;
  };

  // 💡 稳妥的做法：当弹窗彻底打开并渲染完成后，再触发滚动到今天
  const handleAfterShow = () => {
    if (dateRef.current) {
      if(selectionModeValue === 'range'){
        const date = dayjs((value as [Date,Date])[0])
        dateRef.current.jumpTo({
          year: date.year(),
          month: date.month()+ 1,
        });
      }else{
        const date = dayjs(value as Date)
        dateRef.current.jumpTo({
          year: date.year(),
          month: date.month()+ 1,
        });
      }
    }
  };

  return (
    <>
      <div
        className={'flex items-center border border-(--border) py-1 px-3 rounded-(--rounder-radius) active:opacity-75'}
        onClick={(event) => {
          event.preventDefault();
          setDatePicker(true);
        }}
      >
        <CalendarOutline fontSize={16} color={'var(--text)'}/>
        <span className={'ml-3 text-[1.2rem] text-(--text)'}>
          {renderDateText()}
        </span>
      </div>

      <Popup
        visible={datePicker}
        style={{ '--z-index': '9999999' }}
        onMaskClick={() => setDatePicker(false)}
        bodyStyle={{ height: '80vh' }}
        destroyOnClose
        afterShow={handleAfterShow} // 💡 核心优化：代替 setTimeout 确保 100% 能拿到 ref 并正常滚动
      >
        <CalendarPickerView
          ref={dateRef}
          max={nowDate}
          min={oneYearAgo}
          onChange={changePickerDate}
          {...(selectionModeValue === 'single'
              ? { selectionMode: 'single', value: value as Date }
              : { selectionMode: 'range', value: value as [Date, Date] }
          )}
        />
      </Popup>
    </>
  );
}

export default memo(DatePicker);
