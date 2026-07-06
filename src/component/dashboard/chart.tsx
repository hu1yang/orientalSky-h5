import {memo, useRef, forwardRef, useImperativeHandle} from "react";
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
  barData: number[],
  lineData: number[],
  barColor: { offset: number, color: string }[],
  lineColor: string
  type?: 'default'|'branch'
}

const getBaseOption = ({
                         titleTips,
                         title,
                         xData,
                         barData,
                         lineData,
                         barColor,
                         lineColor,
                         type
                       }: IBaseOption, satus: 'default' | 'retrieval') => {

  // eslint-disable-next-line no-useless-assignment
  let tooltip = {}
  // eslint-disable-next-line no-useless-assignment
  let series = []
  if (satus === 'default') {
    tooltip = {trigger: 'axis', axisPointer: {type: 'shadow'}}
    series = [
      {
        name: titleTips[0],
        type: 'bar',
        yAxisIndex: 0,
        data: barData,
        barMaxWidth: 40,
        itemStyle: {
          color: new echarts.graphic.LinearGradient(0, 0, 0, 1, barColor)
        }
      },
      {
        name: titleTips[1],
        type: 'line',
        yAxisIndex: 1,
        data: lineData,
        smooth: true,
        symbol: 'circle',
        symbolSize: 8,
        lineStyle: {width: 3, color: lineColor},
        itemStyle: {color: lineColor},
      }
    ]

  } else {
    tooltip = {
      trigger: 'axis',
      axisPointer: {type: 'shadow'},
      formatter: (params: any) => {
        let str = `${params[0].axisValue}<br/>`
        params.forEach((p: any) => {
          str += `${p.seriesName}: ${p.data.toLocaleString()}<br/>`
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
      barMaxWidth: 40,
      itemStyle: {
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
        symbolSize: 8,
        lineStyle: {width: 3, color: lineColor},
        itemStyle: {color: lineColor},
      }
    ]

  }

  return {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: {fontSize: 16, fontWeight: 'bold', color: '#333'}
    },
    tooltip,
    legend: {
      top: 50,
      textStyle: {color: '#555'},
      itemGap: 30,
      data: titleTips
    },
    grid: {left: 5, right: 5, bottom: 60, top: 80, containLabel: true},
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: {alignWithLabel: true},
      axisLabel: {
        rich: {
          left: {
            align: 'right'
          },
          right: {
            align: 'left'
          }
        }
      }
    },
    yAxis: [
      {
        type: 'value',
        position: 'left',
        axisLabel: {
          width: 0,
          inside: true,
          overflow: 'truncate',
          formatter: (val: number) => `$${val.toLocaleString()}`
        }
      },
      {
        type: 'value',
        position: 'right',
        axisLabel: {
          width: 0,
          inside: true,
          overflow: 'truncate',
          formatter: '{value} segs'
        }
      }
    ],
    series,
    dataZoom: [
      {
        type: 'slider',
        bottom: 25,
        height: 26,
        handleSize: 18,
        showDetail: false,
      }
    ]
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

    chartInstance.current?.setOption(
      getBaseOption(data,type)
    )
  }

  const removeChart = () => {
    if (chartInstance.current) {
      chartInstance.current.dispose()
      chartInstance.current = null
    }
  }

  return (
    <div ref={chartRef} className={'h-[600px]'}></div>
  )
}))
