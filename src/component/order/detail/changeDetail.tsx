import {memo, useCallback, useEffect, useMemo, useRef, useState} from "react";
import {useTranslation} from "react-i18next";
import {useDetailData} from "@/context/order/detailContext.tsx";

import {Button, Grid, Tabs} from "antd-mobile";
import {getChangeInfoGroup} from "@/utils/request/group.ts";

import type {IChange, Itinerary, Passenger} from "@/types/order.ts";

import PassengerCard from "@/component/order/detail/PassengerCard.tsx";
import SegmentCard from "@/component/order/detail/segmentCard.tsx";
import PriceConfirmation from "@/component/order/detail/priceConfirmation.tsx";
import {statusChangeArs} from "@/utils/common.ts";
import RCAmount from "@/component/order/form/rcAmount.tsx";
import NoData from "@/component/default/noData.tsx";

export default memo(function ChangeDetail({changeList, passengers, itineraries}: {
  changeList: IChange[]
  passengers: Passenger[]
  itineraries: Itinerary[]
}) {
  const {t} = useTranslation()
  const [changeTab, setChangeTab] = useState('')
  const amountRef = useRef<{
    openSurePop:(passengers: Passenger[],id: string) => void
  }>(null);

  const {setChangeList} = useDetailData()

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

  const totalPrice = useMemo(() => {
    if(!changeDetail?.confirmed) return 0
    const total = changeDetail?.confirmed.amounts.reduce((sum, amount) => {
      const netRefundAmount = Number(amount.netChangeAmount) || 0
      return sum + netRefundAmount;
    }, 0);

    return Math.round(total * 100) / 100; // 最终总价再处理一遍
  }, [changeDetail])

  const sureAmount = () => {
    if(amountRef.current){
      amountRef.current.openSurePop(changePassenger,changeTab as string)
    }
  }

  const getDetail = useCallback(async () => {
    const response = await getChangeInfoGroup(changeTab as string)
    const newChangeList = changeList.map(item =>
      item.id === response.id ? {...response}:item
    )

    setChangeList(newChangeList)
  },[changeTab,changeList])


  useEffect(() => {
    if(changeList.length && !changeTab){
      setChangeTab(changeList[0].id)
    }
  },[changeList,changeTab])

  return (
    <div>
      {
        changeList.length ? (
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
                      <PriceConfirmation confirmed={change.confirmed} currency={change.order?.currency || ''} type={'change'} totalPrice={totalPrice} />
                    )
                  }
                  <Grid columns={2} gap={8} className={'sticky bottom-0 left-0 mt-5'}>
                    <Grid.Item>
                      <Button block style={{
                        '--background-color':'var(--success-color)'
                      }} onClick={sureAmount}>金额确认</Button>
                    </Grid.Item>
                    <Grid.Item>
                      <Button block>金额驳回</Button>
                    </Grid.Item>
                  </Grid>
                </Tabs.Tab>
              ))
            }
          </Tabs>
        )
        :
        <NoData />
      }
      <RCAmount ref={amountRef} resetDetailFnc={getDetail} type={'change'} />
    </div>
  )
})
