import { memo, useEffect, useMemo, useState} from "react";
import {useTranslation} from "react-i18next";
import {Tabs} from "antd-mobile";
import type {IChange, Itinerary, Passenger} from "@/types/order.ts";
import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import PriceConfirmation from "@/component/order/detail/priceConfirmation.tsx";
import {statusChangeArs} from "@/utils/common.ts";

export default memo(function ChangeDetail({changeList, passengers, itineraries}: {
  changeList: IChange[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [changeTab, setChangeTab] = useState('')

  const changeDetail = useMemo(() => {
    return changeList.find(change => change.id === changeTab)
  },[changeTab,changeList])

  const changePassenger = useMemo(() => {
    const rpIdArr = changeDetail?.changeForPassengers.map(rp => rp.subPassengerId)
    return passengers.filter(p => rpIdArr?.includes(p.id))
  },[passengers,changeDetail])

  const changeItineraries = useMemo(() => {
    if (!itineraries || !changeDetail?.changeForItineraries) return [];

    const changeMap = new Map(
      changeDetail.changeForItineraries.map(ri => [ri.subItineraryId, ri])
    );

    return itineraries
      .filter(it => changeMap.has(it.id))
      .map(it => {
        const riArr = changeMap.get(it.id);
        const segments = it.segments.filter(segment => {
          if (!riArr?.flightNumbers || riArr.flightNumbers.length === 0) {
            return true;
          }
          return riArr.flightNumbers.includes(segment.flightNumber);
        });
        return {
          ...it,
          segments,
          changeSegments:riArr?.segments
        };
      });
  }, [itineraries, changeDetail]);

  useEffect(() => {
    if(changeList.length){
      setChangeTab(changeList[0].id)
    }
  },[changeList])

  return (
    <div>
      {
        !!changeList.length && (
          <Tabs activeKey={changeTab} style={{
            '--title-font-size':'1rem',
            '--content-padding':'12px 0'
          }} onChange={(val) => setChangeTab(val)}>
            {
              changeList.map(change => (
                <Tabs.Tab key={change.id} title={`${change.id}(${t('common.'+ statusChangeArs[change.status])})`}>
                  <PassengerCard passengers={changePassenger} status={'change'} />
                  <SegmentCard itineraryList={changeItineraries} status={'change'} />
                  {
                    !!change.confirmed && (
                      <PriceConfirmation confirmed={change.confirmed} currency={change.order?.currency || ''} />
                    )
                  }
                </Tabs.Tab>
              ))
            }
          </Tabs>
        )
      }
    </div>
  )
})
