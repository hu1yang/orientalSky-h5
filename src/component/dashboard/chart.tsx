import {memo, useRef, forwardRef, useImperativeHandle, useEffect} from "react";
import i18n from '@/i18n';

import * as echarts from 'echarts/core';
import {BarChart, LineChart, PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, LegendComponent} from 'echarts/components';
import type {ECharts} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";

echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  DataZoomComponent,
  LegendComponent,
  BarChart,
  LineChart,
  CanvasRenderer,
  PieChart
]);

interface IBaseOption {
  titleTips: string[]
  title: string
  xData: string[],
  barData: number[] | number[][],
  lineData: number[],
  barColor: { offset: number, color: string }[],
  lineColor: string
  type?: 'default'|'branch'
  hideTitle?: boolean
}

const formatCompact = (value: number) => {
  if (Math.abs(value) >= 1_000_000) return `${(value / 1_000_000).toFixed(1).replace('.0', '')}m`
  if (Math.abs(value) >= 1_000) return `${(value / 1_000).toFixed(1).replace('.0', '')}k`
  return value.toLocaleString()
}

const getBaseOption = ({
                         titleTips,
                         title,
                         xData,
                         barData,
                         lineData,
                         barColor,
                         lineColor,
                         type,
                         hideTitle = false
                       }: IBaseOption, satus: 'default' | 'retrieval') => {

  // eslint-disable-next-line no-useless-assignment
  let tooltip = {}
  // eslint-disable-next-line no-useless-assignment
  let series = []
  if (satus === 'default') {
    tooltip = {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(22, 28, 45, .94)',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: {color: '#fff', fontSize: 12},
      axisPointer: {type: 'shadow', shadowStyle: {color: 'rgba(79, 70, 229, .05)'}},
      formatter: (params: any[]) => {
        const rows = params.map((p) => {
          const value = Number(p.data || 0).toLocaleString()
          const prefix = p.seriesType === 'bar' ? '$' : ''
          return `${p.marker}${p.seriesName}<span style="float:right;margin-left:20px;font-weight:600">${prefix}${value}</span>`
        })
        return `<div style="margin-bottom:6px;font-weight:600">${params[0]?.axisValue ?? ''}</div>${rows.join('<br/>')}`
      }
    }
    series = [
      {
        name: titleTips[0],
        type: 'bar',
        yAxisIndex: 0,
        data: barData,
        barMaxWidth: 24,
        barMinHeight: 2,
        emphasis: {focus: 'series'},
        itemStyle: {
          borderRadius: [6, 6, 2, 2],
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, barColor)
        }
      },
      {
        name: titleTips[1],
        type: 'line',
        yAxisIndex: 1,
        data: lineData,
        smooth: true,
        showSymbol: false,
        symbol: 'circle',
        symbolSize: 7,
        emphasis: {focus: 'series', scale: 1.3},
        lineStyle: {width: 2.5, color: lineColor, cap: 'round'},
        itemStyle: {color: '#fff', borderColor: lineColor, borderWidth: 2},
      }
    ]

  } else {
    tooltip = {
      trigger: 'axis',
      confine: true,
      backgroundColor: 'rgba(22, 28, 45, .94)',
      borderWidth: 0,
      padding: [10, 12],
      textStyle: {color: '#fff', fontSize: 12},
      axisPointer: {type: 'shadow', shadowStyle: {color: 'rgba(79, 70, 229, .05)'}},
      formatter: (params: any) => {
        let str = `<div style="margin-bottom:6px;font-weight:600">${params[0].axisValue}</div>`
        params.forEach((p: any) => {
          str += `${p.marker}${p.seriesName}<span style="float:right;margin-left:20px;font-weight:600">${p.data.toLocaleString()}</span><br/>`
        })
        if (type === 'branch') {
          const data1 = params[0].data
          const data2 = params[1].data
          const ratio = data2 === 0 ? (data1 === 0 ? '0:1' : '∞:1') : (data1 / data2).toFixed(0)
          str += `${i18n.t('home.detectionRatio')}: (${ratio}: 1)`
        }
        return str
      }
    }

    const seriesDefault = barData.map((bd, bdIndex) => ({
      name: titleTips[bdIndex],
      type: 'bar',
      yAxisIndex: 0,
      data: bd,
      barMaxWidth: 18,
      barMinHeight: 2,
      barGap: '18%',
      emphasis: {focus: 'series'},
      itemStyle: {
        borderRadius: [5, 5, 2, 2],
        color: barColor[bdIndex].color
      }
    }))

    series = [
      ...seriesDefault,
      {
        name: titleTips[3],
        type: 'line',
        yAxisIndex: 1,
        data: lineData,
        smooth: true,
        symbol: 'circle',
        showSymbol: false,
        symbolSize: 7,
        emphasis: {focus: 'series', scale: 1.3},
        lineStyle: {width: 2.5, color: lineColor, cap: 'round'},
        itemStyle: {color: '#fff', borderColor: lineColor, borderWidth: 2},
      }
    ]

  }

  return {
    title: {
      show: !hideTitle,
      text: title,
      left: 'center',
      top: 4,
      textStyle: {fontSize: 14, fontWeight: 600, color: '#20283a'}
    },
    tooltip,
    legend: {
      top: hideTitle ? 6 : 34,
      left: 'center',
      icon: 'roundRect',
      itemWidth: 12,
      itemHeight: 8,
      textStyle: {color: '#687086', fontSize: 11},
      itemGap: 18,
      data: titleTips
    },
    grid: {
      left: 8,
      right: 8,
      bottom: xData.length > 10 ? 44 : 20,
      top: hideTitle ? 44 : 68,
      containLabel: true
    },
    xAxis: {
      type: 'category',
      data: xData,
      boundaryGap: true,
      axisLine: {lineStyle: {color: '#dce2ec'}},
      axisTick: {show: false},
      axisLabel: {
        color: '#8a93a6',
        fontSize: 10,
        margin: 10,
        hideOverlap: true,
        formatter: (value: string) => value.length > 8 ? `${value.slice(0, 8)}…` : value
      }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        min: 0,
        splitNumber: 4,
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {lineStyle: {color: '#edf0f5', type: 'dashed'}},
        axisLabel: {
          color: '#9aa2b2',
          fontSize: 10,
          formatter: (val: number) => satus === 'default' ? `$${formatCompact(val)}` : formatCompact(val)
        }
      },
      {
        type: 'value',
        position: 'right',
        min: 0,
        splitNumber: 4,
        axisLine: {show: false},
        axisTick: {show: false},
        splitLine: {show: false},
        axisLabel: {color: '#9aa2b2', fontSize: 10, formatter: (val: number) => formatCompact(val)}
      }
    ],
    series,
    dataZoom: xData.length > 10 ? [
      {type: 'inside', start: 0, end: Math.max(35, Math.round(1000 / xData.length))},
      {
        type: 'slider',
        bottom: 6,
        height: 16,
        borderColor: 'transparent',
        backgroundColor: '#f2f4f8',
        fillerColor: 'rgba(79, 70, 229, .12)',
        handleStyle: {color: '#fff', borderColor: '#7c6fdb'},
        moveHandleStyle: {color: '#7c6fdb'},
        dataBackground: {lineStyle: {color: '#c8ceda'}, areaStyle: {color: '#e4e7ee'}},
        selectedDataBackground: {lineStyle: {color: '#7c6fdb'}, areaStyle: {color: '#cbc5f3'}},
        showDetail: false,
      }
    ] : []
  }
}

export default memo(forwardRef(function Charts(_, ref) {
  const chartRef = useRef(null)
  const chartInstance = useRef<ECharts | null>(null)

  useImperativeHandle(ref, () => {
    return {
      setChart,
      removeChart
    }
  })

  const setChart = (data: IBaseOption,type:'retrieval'|'default' = 'default' ) => {
    if (chartRef.current) {
      chartInstance.current =
        echarts.getInstanceByDom(chartRef.current) || echarts.init(chartRef.current)
    }

    chartInstance.current?.setOption(getBaseOption(data,type), {notMerge: true})
  }

  const removeChart = () => {
    if (chartInstance.current) {
      chartInstance.current.dispose()
      chartInstance.current = null
    }
  }

  useEffect(() => {
    const chartElement = chartRef.current
    if (!chartElement) return
    const resizeObserver = new ResizeObserver(() => chartInstance.current?.resize())
    resizeObserver.observe(chartElement)
    return () => {
      resizeObserver.disconnect()
      removeChart()
    }
  }, [])

  return (
    <div ref={chartRef} className={'dashboard-chart'} role="img" aria-label="Data chart"></div>
  )
}))
