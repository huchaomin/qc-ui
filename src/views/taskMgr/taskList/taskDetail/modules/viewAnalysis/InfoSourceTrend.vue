<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import { saveAs } from 'file-saver'
import slider from 'img/slider.png?url'
import VChart from '@/plugins/echarts'

const platformOptions = useDicOptions('platform')
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const colorArr = inject<string[]>('colorArr')!
const id = inject<string>('id')!
const startEndTimeRange = inject<Ref<[] | [string, string]>>('startEndTimeRange')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const dataType = inject<number>('dataType')!
const chartDataType = ref(1)
const { data } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('yq/taskView/platformTrend', {
      cacheFor: 60 * 1000,
      params: {
        dataId: id,
        dataType,
        endTime: startEndTimeRange.value[1],
        groupType: chartDataType.value,
        startTime: startEndTimeRange.value[0],
      },
    }),
  [startEndTimeRange, chartDataType],
  {
    immediate: true,
    initialData: [],
    sendable: () => {
      return !!startEndTimeRange.value.length && chartDataType.value !== 1
    },
  },
)
const symbolArr = [
  'emptyCircle',
  'emptyRect',
  'emptyTriangle',
  'emptyDiamond',
  'emptyRoundRect',
  'circle',
  'rect',
  'triangle',
  'diamond',
  'roundRect',
]
const chartData = computed(() => {
  const platformTrend = chartDataType.value !== 1 ? data.value : taskViewData.value.platformTrend
  const all = platformTrend?.all

  if (!all || all.length === 0) {
    return {
      series: [],
      xAxisData: [],
    }
  }

  const sortAll = all.sort((a: Record<string, any>, b: Record<string, any>) => {
    return dayjs(a.dateTime).isBefore(dayjs(b.dateTime)) ? -1 : 1
  })
  const timeArr = [sortAll[0].dateTime]
  const addMap = {
    1: [1, 'hour'],
    2: [6, 'hour'],
    3: [12, 'hour'],
    4: [1, 'day'],
  } as const

  while (
    dayjs(timeArr[timeArr.length - 1])
      .add(
        addMap[chartDataType.value as keyof typeof addMap][0],
        addMap[chartDataType.value as keyof typeof addMap][1],
      )
      .isSameOrBefore(dayjs(sortAll[sortAll.length - 1].dateTime))
  ) {
    timeArr.push(
      dayjs(timeArr[timeArr.length - 1])
        .add(
          addMap[chartDataType.value as keyof typeof addMap][0],
          addMap[chartDataType.value as keyof typeof addMap][1],
        )
        .format('YYYY-MM-DD HH:mm:ss'),
    )
  }

  const obj: Record<string, any> = {
    series: [],
    xAxisData: timeArr,
  }

  Object.keys(platformTrend).forEach((platform: string) => {
    const data = timeArr.map((time) => {
      return (
        platformTrend[platform].find((item: Record<string, any>) => item.dateTime === time)
          ?.count ?? 0
      )
    })
    const platformItem = platformOptions.value.find(
      (item: Record<string, any>) => item.value === platform,
    )

    if (platformItem) {
      obj.series.push({
        data,
        index: Number(platform),
        name: platformItem.label,
        symbol: symbolArr[Number(platform) - 1],
      })
    } else {
      if (platform === 'all') {
        obj.series.push({
          data,
          index: -1,
          name: '所有平台',
          symbol: symbolArr[symbolArr.length - 1],
        })
      } else {
        obj.series.push({
          data,
          index: Infinity,
          name: platform,
          symbol: symbolArr[symbolArr.length - 2],
        })
      }
    }
  })
  obj.series = obj.series.sort((a: Record<string, any>, b: Record<string, any>) => {
    return a.index - b.index
  })
  return obj
})
const isMounted = useMounted()
const chartOption = computed<OptionType>(() => {
  return {
    backgroundColor: bgColor,
    color: colorArr,
    dataZoom: [
      {
        backgroundColor: '#F0F2F5',
        borderColor: 'transparent',
        bottom: padding,
        brushSelect: false,
        dataBackground: {
          areaStyle: {
            color: '#CED4D9',
            opacity: 0.5,
          },
          lineStyle: {
            opacity: 0,
          },
        },
        fillerColor: 'transparent',
        handleIcon: `image://${slider}`,
        handleLabel: {
          show: true,
        },
        height: 30,
        left: padding + 2,
        right: padding + 2,
        show: true,
        start: chartData.value.xAxisData.length > 10 ? 50 : 0,
        textStyle: {
          // handle 两边的文字
          color: 'transparent',
        },
        type: 'slider',
      },
      {
        filterMode: 'none',
        type: 'inside',
      },
    ],
    grid: {
      bottom: 1.5 * padding + 30,
      left: padding,
      outerBoundsMode: 'same',
      right: padding,
      top: padding * 5,
    },
    legend: {
      left: 150,
      textStyle: {
        color: '#727476',
        fontSize: 12,
      },
      top: padding + 2,
    },
    series: chartData.value.series.map((item: Record<string, any>) => {
      return {
        data: item.data,
        markPoint: {
          data: [
            {
              label: {
                backgroundColor: 'inherit',
                borderRadius: 3,
                color: '#fff',
                offset: [0, -16],
                padding: 5,
              },
              name: '最大值',
              symbolSize: 0,
              type: 'max',
            },
          ],
        },
        name: item.name,
        symbol: item.symbol,
        symbolSize: 8,
        type: 'line',
      }
    }),
    title: {
      left: padding,
      text: '信息来源走势图',
      textStyle: {
        color: '#727476',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
      },
      top: padding,
    },
    tooltip: {
      backgroundColor: 'rgba(101,101,101,0.75)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
      },
      trigger: 'axis',
    },
    xAxis: {
      axisLabel: {
        formatter(value: string) {
          return dayjs(value).format('YYYY-MM-DD HH:mm')
        },
      },
      axisLine: {
        lineStyle: {
          color: '#e9e9e9',
        },
      },
      axisTick: {
        alignWithLabel: true,
        show: true,
      },
      data: chartData.value.xAxisData,
      type: 'category',
    },
    yAxis: [
      {
        splitLine: {
          lineStyle: {
            color: '#e9e9e9',
            type: 'dashed',
          },
        },
        type: 'value',
      },
    ],
  }
})
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const parentData = inject<Ref<null | Record<string, any>>>('data')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${parentData.value!.name}_信息来源走势图_${new Date().valueOf()}.png`)
}

const aspectRatioX = inject<number>('aspectRatioX')!
</script>

<template>
  <div class="chart_border">
    <div class="operation">
      <TRadioGroup
        v-model="chartDataType"
        theme="button"
        :options="[
          {
            label: '1小时',
            value: 1,
          },
          {
            label: '6小时',
            value: 2,
          },
          {
            label: '12小时',
            value: 3,
          },
          {
            label: '一天',
            value: 4,
          },
        ]"
      >
      </TRadioGroup>
      <TButton theme="default" class="ml-3!" @click="handleDownloadImage">下载图片</TButton>
    </div>
    <VChart
      v-if="isMounted"
      ref="chartRef"
      :option="chartOption"
      style="width: 100%"
      :style="{ aspectRatio: `${aspectRatioX}/400` }"
      :autoresize="true"
    ></VChart>
  </div>
</template>
