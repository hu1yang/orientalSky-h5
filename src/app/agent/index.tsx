import {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router";

import {useTranslation} from "react-i18next";

import {selectAgentMap} from "@/store/modules/base.ts";

import {
  Button,
  Card, Dialog,
  Divider,
  Loading,
  PullToRefresh,
  SearchBar,
  Space,
  Tag
} from "antd-mobile";

import CardText from "@/component/card/cardText.tsx";

import {getAgentsCount} from "@/utils/request/identity.ts";
import {useSelector} from "react-redux";

import type {Agents, AgentsSearchForm} from "@/types/identity.ts";
import {resetAgentHistoryGroup} from "@/utils/request/group.ts";
import {result} from "@/utils/public.ts";
import NoData from "@/component/default/noData.tsx";


type IAgent = Agents & {
  branchCode: string
  agentCode: string
}
export default function Index() {
  const {t} = useTranslation()
  const navigate = useNavigate()
  const agentMap = useSelector(selectAgentMap)


  const [loading, setLoading] = useState(true)
  const {id,agentId} = useParams()

  const [searchForm, setSearchForm] = useState<AgentsSearchForm>({
    branchId: id||'',
    agentId: agentId||'',
    code:'',
    country:'',
    groupCode:'',
    name:'',
  })
  const [agents, setAgents] = useState<IAgent[]>([])

  const resetHistory = (id: string) => {
    Dialog.confirm({
      content: t('quote.resetVerificationHistorytips'),
      onConfirm: async () => {
        const resposne = await resetAgentHistoryGroup(id)
        result(resposne)
        if(resposne.succeed){
          getData()
        }else{
          throw new Error()
        }
      }
    })
  }

  const searchFilter = (val: string) => {
    setSearchForm(prev => ({
      ...prev,
      name:val
    }))
  }

  const getData = async () => {
    // setLoading(true)
    try {
      const response = await getAgentsCount(searchForm)
      const data = response.items.map(item => {
        const info = agentMap.get(item.id)
        return {
          branchCode: info?.branchCode,
          agentCode: info?.agentCode,
          ...item
        }
      })
      setAgents(data)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const initData = () => {
      getData()
    }
    initData()
  }, [searchForm]);

  return (
      <section className={'containerMain'}>
        <div className={'flex items-center py-2 px-2 z-99 sticky top-(--header-height) left-0 bg-(--bg)'}>
          <SearchBar className={'flex-1'} placeholder={t('order.agent')}
                     style={{'--background': '#e8e9ed', '--border-radius': '20px'}} onSearch={searchFilter}
                     onClear={() => searchFilter('')}/>
        </div>
        <div className={'p-2'}>
          {
            !loading ?
              <PullToRefresh onRefresh={getData}>
                {
                  agents.length?agents.map((item) => (
                    <Card className={'mb-2'} title={<span className={'font-semibold line-clamp-1 text-[1.2rem] text-left break-all'}>{item.code}</span>}
                          extra={<Tag round
                                      color={item.isLocked ? 'danger' : 'success'}>{item.isLocked?t('group.locking'):t('foundation.normal')}</Tag>}
                          key={item.id}>
                      <div className={'text-left'}>
                        <p className={'line-clamp-1 font-normal text-[1.2rem] !mb-2 text-(--primary-color)'}>{item.branchCode}</p>
                        <div>
                          <CardText label={t('group.balance')} value={<><em className={'text-[1.8rem]'}>$</em>
                            {item.balance}</>} valueStyle={'text-[1.5rem] !text-[#67c23a]'} />
                          <CardText label={t('group.agencyCode')} value={item.code} valueStyle={'!text-(--active-color) !text-[1.2rem]'} />
                          <CardText label={t('group.agencyAddress')} value={item.localAddress} valueStyle={'line-clamp-1'} style={'items-start'} />
                          <CardText label={t('common.routerChannelList')} value={
                            <Space wrap style={{ '--gap': '4px' }}>
                              {
                                item.channelCodes?.map(channel => <Tag color='#2db7f5' key={channel}>{channel}</Tag>)
                              }
                            </Space>
                          } style={'items-start'} />
                          <div className={'flex'}>
                            <label className={'text-[1rem] w-30 inline-block'}>{t('home.proportion')}</label>
                            <div className={'flex-1 flex flex-col'}>
                          <span className={'text-amber-500'}>
                            <em className={'w-30 inline-block'}>{t('base.scaleLimited')}:</em>
                            {item.scale?.scaleLimited || 0}</span>
                              <span className={'text-amber-500'}>
                            <em className={'w-30 inline-block'}>{t('order.queryLimited')}:</em>
                                {item.scale?.queryLimited || 0}</span>
                              <span className={'text-red-500'}>
                            <em className={'w-30 inline-block'}>{t('base.totalQueryTimes')}:</em>
                                {item.scale?.totalQueryTimes || 0}</span>
                              <span className={'text-amber-500'}>
                            <em className={'w-30 inline-block'}>{t('base.totalAddtoTimes')}:</em>
                                {item.scale?.totalAddtoTimes || 0}</span>
                              <span className={'text-red-500'}>
                            <em className={'w-30 inline-block'}>{t('base.availableCounts')}:</em>
                                {item.scale?.availableCounts || 0}</span>
                              <span className={'text-amber-500'}>
                            <em className={'w-30 inline-block'}>{t('base.limitedDayLength')}:</em>
                                {item.scale?.limitedDayLength || 0}D</span>
                            </div>
                          </div>
                        </div>
                      </div>
                      <Divider />
                      <div className={'flex justify-end'}>
                        <Space justify={'end'}>
                          <Button shape='rounded' size={'small'} onClick={() => resetHistory(item.id)}>{t('quote.resetVerificationHistory')}</Button>
                          <Button shape='rounded' color={'warning'} size={'small'} onClick={() => navigate(`/group/agentUser/${item.id}`)}>{t('common.routerUserList')}</Button>
                          <Button shape='rounded' color='primary' size={'small'} onClick={() => navigate(`/group/agentDetail/${item.id}`)}>{t('foundation.detail')}</Button>
                        </Space>
                      </div>
                    </Card>
                  )) : <NoData />
                }
              </PullToRefresh>
              :
              <Loading />
          }
        </div>
      </section>
  )
}
