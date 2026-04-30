import {useCallback, useEffect, useRef, useState} from "react";

import {Button, Card, Grid, Radio, Selector, Space} from "antd-mobile";
import {UndoOutline} from "antd-mobile-icons"

import * as echarts from 'echarts/core';
import {BarChart, LineChart, PieChart} from 'echarts/charts';
import {TitleComponent, TooltipComponent, GridComponent, DataZoomComponent, LegendComponent} from 'echarts/components';
import type {ECharts} from 'echarts/core';
import {CanvasRenderer} from "echarts/renderers";

import {getCssVar} from "@/utils/public.ts";

import DatePicker from "@/component/Date/datePicker.tsx"
import dayjs from "dayjs";

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

interface ICounts {
  totalSegments:number
  totalOrders:number
  totalAmount:number
  totalProfit:number
}

const topArr = [
  {label:'All',value:'all'},
  {label:'Top 10',value:'10'},
  {label:'Top 20',value:'20'},
  {label:'Top 30',value:'30'},
  {label:'Top 40',value:'40'},
  {label:'Top 50',value:'50'},
]

function pluckFields<T extends Record<string, any>>(arr: T[], fields: string[]) {
  const result: Record<string, any[]> = {}

  fields.forEach(field => {
    result[field] = arr.map(item => {
      const keys = field.split('.')
      let value: T = item
      for (const key of keys) {
        value = value?.[key]
      }
      return value
    })
  })

  return result
}

const primaryColor = getCssVar('--active-color')
const priceColor = getCssVar('--price-color')

const getBaseOption = (
  title: string,
  xData: string[],
  barData: number[],
  lineData: number[],
  barColor: {offset:number ,color:string}[],
  lineColor: string,
  types:'total'|'default'|'agent'|'seg'='default'
) => {
  const titleTips =
    types === 'total'
      ? [
        `销售金额 ($ 26,619)`,
        `航段量 (102)`
      ] : ['销售金额', '航段量'];

  return {
    title: {
      text: title,
      left: 'center',
      top: 10,
      textStyle: { fontSize: 16, fontWeight: 'bold', color: '#333' }
    },
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      top: 50,
      textStyle: { color: '#555' },
      itemGap: 30,
      data: titleTips
    },
    grid: { left: 5, right: 5, bottom: 60, top: 80, containLabel: true },
    xAxis: {
      type: 'category',
      data: xData,
      axisTick: { alignWithLabel: true },
      axisLabel:{
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
    series: [
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
        lineStyle: { width: 3, color: lineColor },
        itemStyle: { color: lineColor },
      }
    ],
    dataZoom: [
      // {
      //     type: 'inside',
      // }
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

function mergeByMonth(list: {
  date:string
  counts:ICounts
}[]):{
  date:string
  counts:ICounts
}[] {
  const map: Record<string, {
    date:string
    counts:ICounts
  }> = {}

  list.forEach(item => {
    const month = item.date.slice(0, 7) // 2026-02

    if (!map[month]) {
      map[month] = {
        date: month,
        counts: { ...item.counts }
      }
    } else {
      const target = map[month].counts
      const source = item.counts

      Object.keys(source).forEach(key => {
        target[key as keyof typeof source] += source[key as keyof typeof source]
      })
    }
  })

  return Object.values(map).map(item => {

    (Object.keys(item.counts) as (keyof ICounts)[]).forEach(key => {
      item.counts[key] = Number(item.counts[key].toFixed(2))
    })

    return item
  })
}

export default function Home(){
  const [dataValue, setDataValue] = useState({
    "counts": {
      "totalAmount": 26619.13,
      "totalDiscount": -510.23,
      "totalOrders": 76,
      "totalSegments": 102,
      "totalProfit": 1408.40,
      "totalBookingAmount": 26327.55
    },
    "branches": [
      {
        "branchCode": "[CAN]Ushine",
        "branchId": "B-Z5OWWPC2-6899",
        "counts": {
          "totalAmount": 24941.43,
          "totalDiscount": -482.95,
          "totalOrders": 64,
          "totalSegments": 87,
          "totalProfit": 1381.88,
          "totalBookingAmount": 24622.57
        }
      },
      {
        "branchCode": "[URC]OSA",
        "branchId": "B-FUFBWIDZ-9115",
        "counts": {
          "totalAmount": 1677.70,
          "totalDiscount": -27.28,
          "totalOrders": 12,
          "totalSegments": 15,
          "totalProfit": 26.52,
          "totalBookingAmount": 1704.98
        }
      }
    ],
    "agents": [
      {
        "agentCode": "重庆云上",
        "agentId": "A-MGOIHOCJ-8818",
        "counts": {
          "totalAmount": 10883.65,
          "totalDiscount": -276.85,
          "totalOrders": 25,
          "totalSegments": 38,
          "totalProfit": 757.60,
          "totalBookingAmount": 11159.19
        }
      },
      {
        "agentCode": "天世元",
        "agentId": "A-DIDFCTSF-8540",
        "counts": {
          "totalAmount": 7376.59,
          "totalDiscount": -178.91,
          "totalOrders": 17,
          "totalSegments": 22,
          "totalProfit": 515.94,
          "totalBookingAmount": 6755.5
        }
      },
      {
        "agentCode": "北京逸趣飞",
        "agentId": "A-I4QU2PW4-5429",
        "counts": {
          "totalAmount": 4573.95,
          "totalDiscount": 0,
          "totalOrders": 11,
          "totalSegments": 14,
          "totalProfit": 56,
          "totalBookingAmount": 4573.45
        }
      },
      {
        "agentCode": "深圳天泰",
        "agentId": "A-5CNC75RO-5163",
        "counts": {
          "totalAmount": 994.39,
          "totalDiscount": -17.47,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 34.98,
          "totalBookingAmount": 1011.86
        }
      },
      {
        "agentCode": "北京引领",
        "agentId": "A-QGUGCDH6-2244",
        "counts": {
          "totalAmount": 845.50,
          "totalDiscount": -11.22,
          "totalOrders": 5,
          "totalSegments": 7,
          "totalProfit": 12.48,
          "totalBookingAmount": 856.72
        }
      },
      {
        "agentCode": "北京说走就走",
        "agentId": "A-OY3pMLIS-604",
        "counts": {
          "totalAmount": 568.10,
          "totalDiscount": -14.40,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 9.60,
          "totalBookingAmount": 582.5
        }
      },
      {
        "agentCode": "一百伟业",
        "agentId": "A-TD9AOYV7-4464",
        "counts": {
          "totalAmount": 541.83,
          "totalDiscount": 0,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 541.83
        }
      },
      {
        "agentCode": "武汉丰谊",
        "agentId": "A-0MUQ1AP4-1773",
        "counts": {
          "totalAmount": 330.40,
          "totalDiscount": -7.50,
          "totalOrders": 2,
          "totalSegments": 3,
          "totalProfit": 5.00,
          "totalBookingAmount": 337.9
        }
      },
      {
        "agentCode": "武汉悦飞",
        "agentId": "A-Q3OGRARJ-4067",
        "counts": {
          "totalAmount": 264.10,
          "totalDiscount": -1.66,
          "totalOrders": 3,
          "totalSegments": 3,
          "totalProfit": 4.44,
          "totalBookingAmount": 265.76
        }
      },
      {
        "agentCode": "自由飞越",
        "agentId": "A-FGPFC7AU-7143",
        "counts": {
          "totalAmount": 146.34,
          "totalDiscount": 0,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 2.88,
          "totalBookingAmount": 146.34
        }
      },
      {
        "agentCode": "北京翼飞行",
        "agentId": "A-04UQIYKT-7870",
        "counts": {
          "totalAmount": 94.28,
          "totalDiscount": -2.22,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 1.48,
          "totalBookingAmount": 96.5
        }
      }
    ],
    "flights": [
      {
        "flightCode": "SAW-KBL",
        "counts": {
          "totalAmount": 8524,
          "totalDiscount": -280,
          "totalOrders": 22,
          "totalSegments": 29,
          "totalProfit": 820,
          "totalBookingAmount": 8804
        }
      },
      {
        "flightCode": "KBL-SAW",
        "counts": {
          "totalAmount": 2580,
          "totalDiscount": -50,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 150,
          "totalBookingAmount": 2630
        }
      },
      {
        "flightCode": "TLV-MSQ,MSQ-TLV",
        "counts": {
          "totalAmount": 1664.66,
          "totalDiscount": -37.48,
          "totalOrders": 1,
          "totalSegments": 4,
          "totalProfit": 25.02,
          "totalBookingAmount": 1702.14
        }
      },
      {
        "flightCode": "IST-KBL",
        "counts": {
          "totalAmount": 1650,
          "totalDiscount": -50,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 150,
          "totalBookingAmount": 1700
        }
      },
      {
        "flightCode": "SAW-KBL,KBL-SAW",
        "counts": {
          "totalAmount": 1316,
          "totalDiscount": -40,
          "totalOrders": 1,
          "totalSegments": 4,
          "totalProfit": 120,
          "totalBookingAmount": 1356
        }
      },
      {
        "flightCode": "CAN-TAS",
        "counts": {
          "totalAmount": 800,
          "totalDiscount": 0,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 0,
          "totalBookingAmount": 0
        }
      },
      {
        "flightCode": "EBB-DXB",
        "counts": {
          "totalAmount": 798.8,
          "totalDiscount": 0,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 798.8
        }
      },
      {
        "flightCode": "ALA-DXB",
        "counts": {
          "totalAmount": 706.81,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 706.81
        }
      },
      {
        "flightCode": "DXB-KBL,KBL-DXB",
        "counts": {
          "totalAmount": 646.2,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 645.2
        }
      },
      {
        "flightCode": "MCT-DXB",
        "counts": {
          "totalAmount": 596.6,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 596.6
        }
      },
      {
        "flightCode": "MSQ-TBS,TBS-MSQ",
        "counts": {
          "totalAmount": 533.49,
          "totalDiscount": -11.01,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 7.34,
          "totalBookingAmount": 544.5
        }
      },
      {
        "flightCode": "DXB-EBL",
        "counts": {
          "totalAmount": 516.8,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 516.8
        }
      },
      {
        "flightCode": "MSQ-SVO",
        "counts": {
          "totalAmount": 480.13,
          "totalDiscount": -11.37,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 7.58,
          "totalBookingAmount": 491.5
        }
      },
      {
        "flightCode": "MSQ-DME",
        "counts": {
          "totalAmount": 463.45,
          "totalDiscount": -11.55,
          "totalOrders": 3,
          "totalSegments": 4,
          "totalProfit": 7.70,
          "totalBookingAmount": 475.0
        }
      },
      {
        "flightCode": "UGC-TAS",
        "counts": {
          "totalAmount": 393.06,
          "totalDiscount": 0,
          "totalOrders": 3,
          "totalSegments": 4,
          "totalProfit": 0,
          "totalBookingAmount": 393.06
        }
      },
      {
        "flightCode": "DXB-DMM",
        "counts": {
          "totalAmount": 361.86,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 361.86
        }
      },
      {
        "flightCode": "GYD-DXB",
        "counts": {
          "totalAmount": 355.59,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 355.59
        }
      },
      {
        "flightCode": "ADD-DXB",
        "counts": {
          "totalAmount": 352.4,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 352.4
        }
      },
      {
        "flightCode": "BGW-DXB",
        "counts": {
          "totalAmount": 340.4,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 340.4
        }
      },
      {
        "flightCode": "MLE-CMB,CMB-MLE",
        "counts": {
          "totalAmount": 315.5,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 8,
          "totalBookingAmount": 315
        }
      },
      {
        "flightCode": "NQZ-MSQ",
        "counts": {
          "totalAmount": 302.77,
          "totalDiscount": -7.47,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4.98,
          "totalBookingAmount": 310.24
        }
      },
      {
        "flightCode": "SKT-DXB",
        "counts": {
          "totalAmount": 296.6,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 296.6
        }
      },
      {
        "flightCode": "DEL-BSZ",
        "counts": {
          "totalAmount": 294.5,
          "totalDiscount": -6.39,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4.26,
          "totalBookingAmount": 300.89
        }
      },
      {
        "flightCode": "DMM-DXB",
        "counts": {
          "totalAmount": 245.23,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 245.23
        }
      },
      {
        "flightCode": "JED-PZU",
        "counts": {
          "totalAmount": 244,
          "totalDiscount": 14,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 14,
          "totalBookingAmount": 229.69
        }
      },
      {
        "flightCode": "HBE-DXB",
        "counts": {
          "totalAmount": 229.19,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4,
          "totalBookingAmount": 229.19
        }
      },
      {
        "flightCode": "SVO-MSQ",
        "counts": {
          "totalAmount": 204.75,
          "totalDiscount": -5.25,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 3.50,
          "totalBookingAmount": 210.0
        }
      },
      {
        "flightCode": "MSQ-SVO,SVO-MSQ",
        "counts": {
          "totalAmount": 198.11,
          "totalDiscount": -4.89,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 3.26,
          "totalBookingAmount": 203
        }
      },
      {
        "flightCode": "LED-MSQ",
        "counts": {
          "totalAmount": 189.56,
          "totalDiscount": -3.84,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 2.56,
          "totalBookingAmount": 193.4
        }
      },
      {
        "flightCode": "OSS-BSZ",
        "counts": {
          "totalAmount": 184.89,
          "totalDiscount": 3,
          "totalOrders": 3,
          "totalSegments": 3,
          "totalProfit": 3,
          "totalBookingAmount": 181.89
        }
      },
      {
        "flightCode": "BSZ-OSS",
        "counts": {
          "totalAmount": 168.7,
          "totalDiscount": 2,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 2,
          "totalBookingAmount": 166.7
        }
      },
      {
        "flightCode": "MSQ-VKO",
        "counts": {
          "totalAmount": 140.84,
          "totalDiscount": -3.66,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 2.44,
          "totalBookingAmount": 144.5
        }
      },
      {
        "flightCode": "DME-MSQ",
        "counts": {
          "totalAmount": 135.84,
          "totalDiscount": -3.66,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 2.44,
          "totalBookingAmount": 139.5
        }
      },
      {
        "flightCode": "VKO-MSQ",
        "counts": {
          "totalAmount": 135.84,
          "totalDiscount": -3.66,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 2.44,
          "totalBookingAmount": 139.5
        }
      },
      {
        "flightCode": "DYU-TAS",
        "counts": {
          "totalAmount": 123.8,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 2.88,
          "totalBookingAmount": 123.8
        }
      },
      {
        "flightCode": "BSZ-TAS",
        "counts": {
          "totalAmount": 106.22,
          "totalDiscount": 1,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 1,
          "totalBookingAmount": 105.22
        }
      },
      {
        "flightCode": "TAS-SKD",
        "counts": {
          "totalAmount": 22.54,
          "totalDiscount": 0,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 0,
          "totalBookingAmount": 22.54
        }
      }
    ],
    "hours": [
      {
        "hour": 0,
        "counts": {
          "totalAmount": 5866.58,
          "totalDiscount": -108.09,
          "totalOrders": 11,
          "totalSegments": 21,
          "totalProfit": 200.76,
          "totalBookingAmount": 5974.67
        }
      },
      {
        "hour": 1,
        "counts": {
          "totalAmount": 3802.44,
          "totalDiscount": -70,
          "totalOrders": 10,
          "totalSegments": 13,
          "totalProfit": 220,
          "totalBookingAmount": 3871.94
        }
      },
      {
        "hour": 2,
        "counts": {
          "totalAmount": 3133.65,
          "totalDiscount": -78.85,
          "totalOrders": 9,
          "totalSegments": 10,
          "totalProfit": 215.90,
          "totalBookingAmount": 3212.5
        }
      },
      {
        "hour": 3,
        "counts": {
          "totalAmount": 1378.13,
          "totalDiscount": -25.40,
          "totalOrders": 5,
          "totalSegments": 7,
          "totalProfit": 43.60,
          "totalBookingAmount": 1403.53
        }
      },
      {
        "hour": 4,
        "counts": {
          "totalAmount": 3614,
          "totalDiscount": -96,
          "totalOrders": 10,
          "totalSegments": 12,
          "totalProfit": 344,
          "totalBookingAmount": 3709.69
        }
      },
      {
        "hour": 5,
        "counts": {
          "totalAmount": 780,
          "totalDiscount": -20,
          "totalOrders": 1,
          "totalSegments": 2,
          "totalProfit": 60,
          "totalBookingAmount": 800
        }
      },
      {
        "hour": 6,
        "counts": {
          "totalAmount": 1233,
          "totalDiscount": -40,
          "totalOrders": 2,
          "totalSegments": 5,
          "totalProfit": 110,
          "totalBookingAmount": 1273
        }
      },
      {
        "hour": 7,
        "counts": {
          "totalAmount": 2313.65,
          "totalDiscount": -30,
          "totalOrders": 6,
          "totalSegments": 8,
          "totalProfit": 110,
          "totalBookingAmount": 2342.65
        }
      },
      {
        "hour": 8,
        "counts": {
          "totalAmount": 694.91,
          "totalDiscount": -8.49,
          "totalOrders": 4,
          "totalSegments": 5,
          "totalProfit": 9.66,
          "totalBookingAmount": 703.4
        }
      },
      {
        "hour": 9,
        "counts": {
          "totalAmount": 292.23,
          "totalDiscount": -2.53,
          "totalOrders": 3,
          "totalSegments": 3,
          "totalProfit": 5.02,
          "totalBookingAmount": 294.76
        }
      },
      {
        "hour": 10,
        "counts": {
          "totalAmount": 800,
          "totalDiscount": 0,
          "totalOrders": 2,
          "totalSegments": 2,
          "totalProfit": 0,
          "totalBookingAmount": 0
        }
      },
      {
        "hour": 11,
        "counts": {
          "totalAmount": 849.83,
          "totalDiscount": -20.89,
          "totalOrders": 3,
          "totalSegments": 4,
          "totalProfit": 62.26,
          "totalBookingAmount": 870.72
        }
      },
      {
        "hour": 12,
        "counts": {
          "totalAmount": 772.8,
          "totalDiscount": 0,
          "totalOrders": 3,
          "totalSegments": 3,
          "totalProfit": 10.88,
          "totalBookingAmount": 772.8
        }
      },
      {
        "hour": 13,
        "counts": {
          "totalAmount": 1087.91,
          "totalDiscount": -9.98,
          "totalOrders": 7,
          "totalSegments": 7,
          "totalProfit": 16.32,
          "totalBookingAmount": 1097.89
        }
      }
    ],
    "channels": [
      {
        "channelCode": "API-RQ-V1",
        "channelName": "RQ",
        "counts": {
          "totalAmount": 14070,
          "totalDiscount": -420,
          "totalOrders": 31,
          "totalSegments": 43,
          "totalProfit": 1240,
          "totalBookingAmount": 14490
        }
      },
      {
        "channelCode": "API-FZ-V1",
        "channelName": "FZ",
        "counts": {
          "totalAmount": 5761.98,
          "totalDiscount": 0,
          "totalOrders": 14,
          "totalSegments": 18,
          "totalProfit": 72,
          "totalBookingAmount": 5760.48
        }
      },
      {
        "channelCode": "API-B2-V1",
        "channelName": "B2",
        "counts": {
          "totalAmount": 4449.44,
          "totalDiscount": -103.84,
          "totalOrders": 17,
          "totalSegments": 25,
          "totalProfit": 69.26,
          "totalBookingAmount": 4553.28
        }
      },
      {
        "channelCode": "API-C6-V1",
        "channelName": "C6",
        "counts": {
          "totalAmount": 1339.40,
          "totalDiscount": 0,
          "totalOrders": 7,
          "totalSegments": 8,
          "totalProfit": 2.88,
          "totalBookingAmount": 539.40
        }
      },
      {
        "channelCode": "API-K9-V1",
        "channelName": "K9",
        "counts": {
          "totalAmount": 459.81,
          "totalDiscount": 6,
          "totalOrders": 5,
          "totalSegments": 6,
          "totalProfit": 6,
          "totalBookingAmount": 453.81
        }
      },
      {
        "channelCode": "API-KA-V1",
        "channelName": "KA",
        "counts": {
          "totalAmount": 294.5,
          "totalDiscount": -6.39,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 4.26,
          "totalBookingAmount": 300.89
        }
      },
      {
        "channelCode": "API-3T-V1",
        "channelName": "3T",
        "counts": {
          "totalAmount": 244,
          "totalDiscount": 14,
          "totalOrders": 1,
          "totalSegments": 1,
          "totalProfit": 14,
          "totalBookingAmount": 229.69
        }
      }
    ]
  })
  const [searchForm, setSearchForm] = useState({
    localTime: dayjs().toDate(),
  })

  const [tops, setTops] = useState<string>('10')
  const [typesModel, setTypesModel] = useState<'totalAmount'|'totalSegments'>('totalAmount')

  const hourAirlineRef = useRef<HTMLDivElement | null>(null);
  const hourAirlineInstance = useRef<ECharts | null>(null);
  const dateAirlineRef = useRef<HTMLDivElement | null>(null)
  const dateAirlineInstance = useRef<ECharts | null>(null)
  const airlineCompanyAmtRef = useRef<HTMLDivElement | null>(null)
  const airlineCompanyAmtInstance = useRef<ECharts | null>(null)
  const agentRef = useRef<HTMLDivElement | null>(null)
  const agentInstance = useRef<ECharts | null>(null)
  const dateSegmentRef = useRef<HTMLDivElement | null>(null)
  const segmentInstance = useRef<ECharts | null>(null)

  const updateCharts = () => {
    const { hour, 'counts.totalAmount': amountTotalAmountHour, 'counts.totalSegments': amountTotalSegmentsHour } = pluckFields<{
      hour:string
      counts:ICounts
    }>(dataValue.hours || [], [
      'hour',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if(hourAirlineInstance.current) {
      const newHour = hour.map(h => `${String(h).padStart(2, '0')}:00`)
      hourAirlineInstance.current.setOption(
        getBaseOption(
          '当日营业额',
          newHour,
          amountTotalAmountHour,
          amountTotalSegmentsHour,
          [{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
          primaryColor,'total'
        )
      )
    }

    let daysArr:{
      date:string
      counts:ICounts
    }[] = dataValue.dates ?? []
    // if(!isDay.value){
    //   daysArr = mergeByMonth(daysArr)
    // }

    const { date:amountData, 'counts.totalAmount': amountTotalAmount, 'counts.totalSegments': amountTotalSegments } = pluckFields<{
      date:string
      counts:ICounts
    }>(daysArr, [
      'date',
      'counts.totalAmount',
      'counts.totalSegments',
    ])

    if(dateAirlineInstance.current) {
      dateAirlineInstance.current.setOption(
        getBaseOption(
          '总营业额',
          amountData,
          amountTotalAmount,
          amountTotalSegments,
          [{offset: 0, color: '#4F208B'},{offset: 1, color: '#9E99C7'}],
          primaryColor,'total'
        )
      )
    }

    const { channelName, 'counts.totalAmount': channelTotalAmount, 'counts.totalSegments': channelTotalSegments } = pluckFields<{
      channelCode:string
      counts:ICounts
    }>(dataValue.channels, [
      'channelName',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (airlineCompanyAmtInstance.current) {
      // airlineCompanyAmtInstance.value.setOption(
      //     getDoubleRingOption(
      //         channelName,
      //         channelTotalAmount,
      //         channelTotalSegments
      //     )
      // )

      airlineCompanyAmtInstance.current.setOption(
        getBaseOption(
          '航司',
          channelName,
          channelTotalAmount,
          channelTotalSegments,
          [{offset: 0, color: '#1B6428'},{offset: 1, color: '#73C476'}],
          primaryColor,'default'
        )
      )

    }

    const { agentCode, 'counts.totalAmount': agentTotalAmount, 'counts.totalSegments': agentTotalSegments } = pluckFields<{
      agentId:string
      counts:ICounts
    }>(dataValue.agents!, [
      'agentCode',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (agentInstance.current) {
      agentInstance.current.setOption(
        getBaseOption(
          '代理人',
          agentCode,
          agentTotalAmount,
          agentTotalSegments,
          [{offset: 0, color: priceColor}],
          primaryColor,'agent'
        )
      )
    }

  }

  const setCanvas = () => {
    if(hourAirlineRef.current){
      hourAirlineInstance.current =
        echarts.getInstanceByDom(hourAirlineRef.current) || echarts.init(hourAirlineRef.current)
    }
    if(dateAirlineRef.current){
      dateAirlineInstance.current =
        echarts.getInstanceByDom(dateAirlineRef.current) || echarts.init(dateAirlineRef.current)
    }
    if (airlineCompanyAmtRef.current) {
      airlineCompanyAmtInstance.current =
        echarts.getInstanceByDom(airlineCompanyAmtRef.current) || echarts.init(airlineCompanyAmtRef.current)
    }
    if (agentRef.current) {
      agentInstance.current =
        echarts.getInstanceByDom(agentRef.current) || echarts.init(agentRef.current)
    }
    if(dateSegmentRef.current){
      segmentInstance.current =
        echarts.getInstanceByDom(dateSegmentRef.current) || echarts.init(dateSegmentRef.current)
    }
    updateCharts()
  }

  const changeCanvas = () => {
    const sorted = [...dataValue.flights].sort(
      (a, b) => b.counts[typesModel] - a.counts[typesModel]
    )

    const data = tops !== 'all' ? sorted.slice(0, Number(tops)) : sorted

    const { flightCode, 'counts.totalAmount': flightTotalAmount, 'counts.totalSegments': flightTotalSegments } = pluckFields<{
      flightCode:string
      counts:ICounts
    }>(data, [
      'flightCode',
      'counts.totalAmount',
      'counts.totalSegments',
    ])
    if (segmentInstance.current) {
      segmentInstance.current.setOption(
        getBaseOption(
          '航段',
          flightCode,
          flightTotalAmount,
          flightTotalSegments,
          [{offset: 0, color: '#174A91'},{offset: 1, color: '#68ADD6'}],
          primaryColor,'seg'
        )
      )
    }
  }

  const changeLocalTime = useCallback((date:Date | [Date, Date]) => {
    if(date && date instanceof Date){
      setSearchForm({...searchForm,localTime: date})
    }
  },[searchForm.localTime])

  const resizeCanvas = () => {
    hourAirlineInstance.current?.resize()
    dateAirlineInstance.current?.resize()
    airlineCompanyAmtInstance.current?.resize()
    agentInstance.current?.resize()
    segmentInstance.current?.resize()
  }

  useEffect(() => {
    setCanvas()
    window.addEventListener('resize', resizeCanvas)

    return () => {
      window.removeEventListener('resize', resizeCanvas)
    }
  },[])

  useEffect(() => {
    changeCanvas()
  }, [tops,typesModel]);

  return (
    <section className={'container'}>
      <Grid columns={2} gap={8}>
        <Grid.Item span={2}>
          <Card title={'交易总额'} extra={<Button fill='none'><UndoOutline fontSize={18} color={'#eebe77'} /></Button>}>
            <div className={'flex justify-start'}>
              <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$23,108</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card title={'利润'}>
            <div className={'flex justify-start'}>
              <span className={'text-left font-bold text-[3rem]/[3rem] text-(--price-color)'}>$1,318</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item span={1}>
          <Card title={'出票订单'}>
            <div className={'flex justify-start'}>
              <span className={'text-left font-bold text-[2rem]/[2rem] text-[#eebe77]'}>61</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item span={1}>
          <Card title={'航段数'}>
            <div className={'flex justify-start'}>
              <span className={'text-left font-bold text-[2rem]/[2rem] text-[#5cadff]'}>86</span>
            </div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card title={'当日营业额'} extra={<DatePicker value={searchForm.localTime} changeDate={changeLocalTime} />}>
            <div ref={hourAirlineRef} className={'h-[600px]'}></div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card title={'代理人'}>
            <div ref={agentRef} className={'h-[600px]'}></div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card title={'航司'}>
            <div ref={airlineCompanyAmtRef} className={'h-[600px]'}></div>
          </Card>
        </Grid.Item>
        <Grid.Item span={2}>
          <Card title={'航段'}>
            <Radio.Group value={typesModel} onChange={v => setTypesModel(v)}>
              <Space direction='horizontal'>
                {
                  [{label:'销售金额',value:'totalAmount'},{label:'航段量',value:'totalSegments'}].map(item => (
                    <Radio value={item.value}  style={{
                      '--icon-size': '18px',
                      '--font-size': '14px',
                      '--gap': '6px',
                    }}>{item.label}</Radio>
                  ))
                }
              </Space>
            </Radio.Group>
            <Selector
              className={'mt-4'}
              options={topArr}
              value={[tops]}
              style={{
                '--padding': '4px 8px',
              }}
              onChange={v => {
                if (v.length) {
                  setTops(v[0])
                }
              }}
            />

            <div ref={dateSegmentRef} className={'h-[600px]'}></div>
          </Card>
        </Grid.Item>
      </Grid>
    </section>
  )
}
