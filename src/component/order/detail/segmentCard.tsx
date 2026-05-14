import React, {memo, useMemo} from 'react'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'
import type {Segment} from '@/types/group.ts'
import {Card, Divider, Steps} from 'antd-mobile'
import type {Itinerary} from "@/types/order.ts";
import {RightOutline} from "antd-mobile-icons";

dayjs.extend(duration)

const {Step} = Steps

type ItineraryChange = Itinerary & {
  changeSegments?: Segment[]
}

const formatTime = (time: string) => dayjs(time).format('HH:mm')

const formatDate = (time: string) => dayjs(time).format('YYYY-MM-DD')

const formatDateTime = (time: string) =>
  dayjs(time).format('YYYY-MM-DD HH:mm')

const totalDuration = (times: string[]) => {
  if (times.length > 0) {
    const totalSeconds = times.reduce((acc, time) => {
      const [hrs, mins, secs] = time.split(':').map(Number);
      return acc + (hrs * 3600) + (mins * 60) + secs;
    }, 0);

    return dayjs.duration(totalSeconds, 'seconds').format("H[h] m[m]");
  }
  return 0;
}

const transferTimer = (prev: Segment, next: Segment) => {
  const diffMinutes = dayjs(next.departureTime).diff(
    dayjs(prev.arrivalTime),
    'minute'
  )

  const hours = Math.floor(diffMinutes / 60)
  const minutes = diffMinutes % 60

  return `${hours}h ${minutes}m`
}

const FlightInfoCard = memo(({segment, familyName}: { segment: Segment, familyName: string }) => {
  return (
    <div className={'py-2 px-6 bg-(--code-bg) rounded-[8px] mt-4 flex items-center justify-between'}>
      <div>
        <p className={'text-[var(--text-h)] font-medium'}>
          {segment.flightNumber}({segment.aircraftModel})
        </p>
        <span className={'text-[var(--text)]'}>{familyName}</span>
      </div>
      <span className={'text-(--text)'}>
        {totalDuration([segment.totalFlyingTime as string])}
      </span>
    </div>
  )
})

const AirportInfo = memo(
  ({
     airport,
     time,
   }: {
    airport: string
    time: string
  }) => {
    return (
      <div className={'flex justify-between'}>
        <h2 className={'!text-[1.8rem]'}>{airport}</h2>

        <div className={'flex flex-col items-end'}>
          <span className={'font-bold text-(--text-h)'}>
            {formatTime(time)}
          </span>
          <span>{formatDate(time)}</span>
        </div>
      </div>
    )
  }
)

const LayoverCard = memo(
  ({
     prevSegment,
     nextSegment,
   }: {
    prevSegment: Segment
    nextSegment: Segment
  }) => {
    return (
      <div className={'flex justify-between py-2 px-4 bg-[#fdedce] rounded-[8px]'}>
        <p className={'!text-[1.2rem] text-[#956631]'}>
          {nextSegment.departureAirport}
        </p>

        <div className={'flex flex-col items-end'}>
          <span className={'font-medium text-(--text-h) text-[#956631]'}>
            Layover · {transferTimer(prevSegment, nextSegment)}
          </span>

          <span className={'text-[#956631]'}>
            {formatTime(prevSegment.arrivalTime)} → {formatTime(nextSegment.departureTime)}
          </span>
        </div>
      </div>
    )
  }
)

const SegmentInfo = memo(({itinerarie, status, segmentsType = 'segments'}: {
  itinerarie: ItineraryChange
  status: 'ticket' | 'refund' | 'change' | 'auxiliary'
  segmentsType: 'segments' | 'changeSegments'
}) => {
  const segmentArr = useMemo(() => {
    if (segmentsType === 'changeSegments') {
      return itinerarie.changeSegments
    }
    return itinerarie.segments
  }, [itinerarie, segmentsType])

  const firstSegment = segmentArr?.[0]
  const lastSegment = segmentArr?.[segmentArr.length - 1]


  return (
    <div>
      <div className={'flex justify-between items-center mb-5'}>
        <p className={'text-[1.3rem] text-(--text)'}>
          {formatDateTime(firstSegment?.departureTime as string)} → {formatDateTime(lastSegment?.arrivalTime as string)}
        </p>
        {
          status !== 'ticket' ?
            <span
              className={`${status === 'refund' ? 'text-(--price-color)' : 'text-(--warning-color)'} text-[1.2rem] font-bold ${(segmentsType === 'segments' && status === 'change') && 'line-through !text-(--price-color)'}`}>
              {
                status === 'change' ? (segmentsType === 'segments' ? '原始数据' : '新数据') : status
              }
            </span>
            :
            <div className={'bg-[#f3f4f6] px-3 py-2 rounded-[20px]'}>
                          <span className={'text-(--text)'}>
                            {totalDuration(
                              segmentArr?.map(segment => segment.totalFlyingTime) as string[]
                            )}
                          </span>
            </div>
        }
      </div>
      <Steps direction='vertical' className={'!px-0'}>
        {
          segmentArr?.map((segment, segmentIndex) => {
            if (segmentIndex > 0) {
              return (
                <Step key={segmentIndex} status={'wait'} title={
                  <div className={'flex flex-col'}>
                    <LayoverCard
                      prevSegment={segmentArr?.[segmentIndex - 1] as Segment}
                      nextSegment={segment}
                    />

                    <FlightInfoCard segment={segment} familyName={itinerarie.amounts[0].familyName}/>
                  </div>
                } style={{
                  '--icon-color': '#dea865',
                }}/>
              )
            }
            return (
              <Step key={segmentIndex} status={'finish'} title={
                <div className={'flex flex-col'}>
                  <AirportInfo
                    airport={segment.departureAirport}
                    time={segment.departureTime}
                  />

                  <FlightInfoCard segment={segment} familyName={itinerarie.amounts[0].familyName}/>
                </div>
              } style={{
                '--line-to-next-color': '#dbdde0',
                '--icon-color': '#0e0f12',
              }}/>
            )
          })
        }
        <Step status={'finish'} title={
          <div className={'flex flex-col'}>
            <AirportInfo
              airport={lastSegment?.arrivalAirport as string}
              time={lastSegment?.arrivalTime as string}
            />
          </div>
        } style={{
          '--line-to-next-color': '#dbdde0',
          '--icon-color': '#0e0f12',
        }}/>
      </Steps>
    </div>
  )
})

export default memo(function SegmentCard({itineraryList, status = 'ticket'}: {
  itineraryList: ItineraryChange[]
  status?: 'ticket' | 'refund' | 'change' | 'auxiliary'
}) {
  return (
    <Card title={'Segments'} extra={<RightOutline/>} className={'mb-5'}>
      {
        itineraryList.map((itinerarie, itinerarieIndex) => (
          <React.Fragment key={itinerarie.id}>
            {
              status === 'change' &&
                <SegmentInfo key={`dataChangeSegments-${itinerarie.id}`} itinerarie={itinerarie} status={status}
                             segmentsType={'changeSegments'}/>
            }
            <SegmentInfo key={`dataSegments-${itinerarie.id}`} itinerarie={itinerarie} status={status}
                         segmentsType={'segments'}/>
            {(itineraryList.length > 0 && itineraryList.length - 1 > itinerarieIndex) &&
                <Divider key={`Divider-${itinerarie.id}`}/>}
          </React.Fragment>
        ))
      }
    </Card>
  )
})
