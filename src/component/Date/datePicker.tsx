import { memo, useState } from "react";
import { CalendarOutline } from "antd-mobile-icons";
import { CalendarPicker } from "antd-mobile";
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

  const changePickerDate = (date: Date | [Date, Date] | null) => {
    if (!date) return;
    changeDate(date);
  };

  const renderDateText = () => {
    if (selectionModeValue === 'single') {
      return dayjs(value as Date).format('YYYY-MM-DD');
    }
    const range = value as [Date, Date];
    return `${dayjs(range[0]).format('YYYY-MM-DD')} - ${dayjs(range[1]).format('YYYY-MM-DD')}`;
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

      <CalendarPicker
        visible={datePicker}
        max={nowDate}
        key={selectionModeValue}
        min={oneYearAgo}
        onMaskClick={() => setDatePicker(false)}
        onClose={() => setDatePicker(false)}
        onConfirm={changePickerDate}
        {...(selectionModeValue === 'single'
            ? { selectionMode: 'single', defaultValue: value as Date }
            : { selectionMode: 'range', defaultValue: value as [Date, Date] }
        )}
        />
    </>
  );
}

export default memo(DatePicker);
