import { memo, useEffect, useMemo, useState} from "react";
import {Tabs} from "antd-mobile";
import type {IRefund, Itinerary, Passenger} from "@/types/order.ts";
import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import PriceConfirmation from "@/component/order/detail/priceConfirmation.tsx";
import {statusRefundArs} from "@/utils/common.ts";
import {useTranslation} from "react-i18next";

export default memo(function RefundDetail({refundList, passengers, itineraries}: {
  refundList: IRefund[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [refundTab, setRefundTab] = useState('')


  const refundDetail = useMemo(() => {
    return refundList.find(refund => refund.id === refundTab)
  },[refundTab,refundList])

  const refundPassenger = useMemo(() => {
    const rpIdArr = refundDetail?.refundForPassengers.map(rp => rp.subPassengerId)
    return passengers.filter(p => rpIdArr?.includes(p.id))
  },[passengers,refundDetail])

  const refundItineraries = useMemo(() => {
    if (!itineraries || !refundDetail?.refundForItineraries) return [];

    const refundMap = new Map(
      refundDetail.refundForItineraries.map(ri => [ri.subItineraryId, ri])
    );

    return itineraries
      .filter(it => refundMap.has(it.id))
      .map(it => {
        const riArr = refundMap.get(it.id);
        const segments = it.segments.filter(segment => {
          if (!riArr?.flightNumbers || riArr.flightNumbers.length === 0) {
            return true;
          }
          return riArr.flightNumbers.includes(segment.flightNumber);
        });

        return {
          ...it,
          segments
        };
      });
  }, [itineraries, refundDetail]);

  useEffect(() => {
    if(refundList.length){
      setRefundTab(refundList[0].id)
    }
  },[refundList])

  return (
    <div>
      {
        !!refundList.length && (
          <Tabs activeKey={refundTab} style={{
            '--title-font-size':'1rem',
            '--content-padding':'12px 0'
          }} onChange={(val) => setRefundTab(val)}>
            {
              refundList.map(refund => (
                <Tabs.Tab key={refund.id} title={`${refund.id}(${t('common.'+ statusRefundArs[refund.status])})`}>
                  <PassengerCard passengers={refundPassenger} status={'refund'} />
                  <SegmentCard itineraryList={refundItineraries} status={'refund'} />
                  {
                    !!refund.confirmed && (
                      <PriceConfirmation confirmed={refund.confirmed} currency={refund.order?.currency || ''} />
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
