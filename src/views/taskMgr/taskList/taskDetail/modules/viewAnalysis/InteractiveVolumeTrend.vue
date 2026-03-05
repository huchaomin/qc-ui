<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import { saveAs } from 'file-saver'
import slider from 'img/slider.png?url'
import VChart from '@/plugins/echarts'

const isMounted = useMounted()
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const colorArr = inject<string[]>('colorArr')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const id = inject<string>('id')!
const startEndTimeRange = inject<Ref<[] | [string, string]>>('startEndTimeRange')!
const dataType = inject<number>('dataType')!
const chartDataType = ref(1)
const { data } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('yq/taskView/interactTrend', {
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
const chartData = computed(() => {
  const interactTrend = chartDataType.value !== 1 ? data.value : taskViewData.value.interactTrend

  if (!interactTrend || interactTrend.length === 0) {
    return []
  }

  const sortAll = interactTrend.sort((a: Record<string, any>, b: Record<string, any>) => {
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

  const arr: Array<Record<string, any>> = []

  timeArr.forEach((dateTime: string) => {
    const result = interactTrend.find((item: Record<string, any>) => item.dateTime === dateTime)

    arr.push({
      commentCount: result?.commentCount ?? 0,
      dateTime,
      favCount: result?.favCount ?? 0,
      forwardCount: result?.forwardCount ?? 0,
      interactNum: result?.interactNum ?? 0,
      likeCount: result?.likeCount ?? 0,
    })
  })
  return arr
})
const nameMap = [
  {
    label: '全部',
    value: 'interactNum',
  },
  {
    label: '评论数',
    value: 'commentCount',
  },
  {
    label: '点赞数',
    value: 'favCount',
  },
  {
    label: '转发数',
    value: 'forwardCount',
  },
  {
    label: '喜欢数',
    value: 'likeCount',
  },
]
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
        start: chartData.value.length > 10 ? 50 : 0,
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
    series: nameMap.map((item: Record<string, any>) => {
      return {
        data: chartData.value.map((dataItem: Record<string, any>) => dataItem[item.value]),
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
        name: item.label,
        smooth: true,
        symbolSize: 3,
        type: 'line',
      }
    }),
    title: {
      left: padding,
      text: '互动声量走势',
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
      data: chartData.value.map((item: Record<string, any>) => item.dateTime),
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

  saveAs(url, `${parentData.value!.name}_互动声量走势_${new Date().valueOf()}.png`)
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
