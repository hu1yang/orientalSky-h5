import {memo, useMemo} from "react";
import {Steps} from "antd-mobile";
import type {Itinerary} from "@/types/order.ts";
import dayjs from "dayjs";

const { Step } = Steps
export default memo(function SegmentBox({itineraries}:{itineraries:Itinerary[]}){

  const segmentMemo = useMemo(() => {
    return itineraries.map(itinerarie => itinerarie.segments)
  },[itineraries])

  return (
    <div className={'bg-[#f0f1f5] rounded-(--rounder-radius) p-1 segmentBox'}>
      <Steps direction='vertical' className={'!p-[8px]'}>

        {
          segmentMemo.map((item,index) => item.map((segment,segmentIndex) => (
            <Step key={`segmentmemo-${index}-segment-${segmentIndex}`} title={
              <div className={'flex items-center justify-between w-full'}>
                <div className={'flex items-center'}>
                  <span className={'text-[1.3rem] font-bold'}>{segment.departureAirport}</span>
                  <span className={'text-[1.3rem] font-bold mx-2'}> -- </span>
                  <span className={'text-[1.3rem] font-bold'}>{segment.arrivalAirport}</span>
                  <span className={'ml-2 text-[1.1rem'}>
                    ({segment.flightNumber})
                  </span>
                </div>
                <div>
                  <span>{dayjs(segment.departureTime).format('MM-DD HH:mm')}</span>
                </div>
              </div>
            } style={{
              '--line-to-next-color': '#96979b',
              '--icon-color': '#96979b',
              '--adm-color-primary': '#050407',
              '--adm-color-weak': '#050407'
            }} status={'finish'}/>
          )))
        }
      </Steps>
    </div>
  )
})
