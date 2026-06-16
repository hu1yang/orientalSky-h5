import {memo} from "react";

export default memo(function CardText({label, value, labelStyle, valueStyle, style = ''}: { label?: React.ReactNode; value: React.ReactNode; labelStyle?: string; valueStyle?: string; style?: string }) {
  return (
    <div className={`flex items-center mb-1 leading-[1.3] ${style}`}>
      {
        !!label &&
          <span className={`text-[1rem] text-(--text) w-30 inline-block ${labelStyle}`}>{label}</span>
      }
      <div className={`text-[var(--text-h)] flex-1 ${valueStyle}`}>{value}</div>
    </div>
  )
})
