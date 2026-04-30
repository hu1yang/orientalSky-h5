import {memo} from "react";

export default memo(function CardText({label, value, labelStyle, valueStyle, style = ''}: { label?: React.ReactNode; value: React.ReactNode; labelStyle?: string; valueStyle?: string; style?: string }) {
  return (
    <div className={`flex items-center mb-1 ${style}`}>
      {
        !!label &&
          <span className={`text-[1rem] w-30 inline-block ${labelStyle}`}>{label}</span>
      }
      <span className={`text-[var(--text-h)] flex-1 ${valueStyle}`}>{value}</span>
    </div>
  )
})
