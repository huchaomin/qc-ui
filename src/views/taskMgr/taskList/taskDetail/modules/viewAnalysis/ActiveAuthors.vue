<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import VChart from '@/plugins/echarts'
import { saveAs } from '@/utils/tool'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const parentData = inject<Ref<null | Record<string, any>>>('data')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${parentData.value!.name}_活跃作者_${new Date().valueOf()}.png`)
}

const id = inject<string>('id')!
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const startEndTimeRange = inject<Ref<[] | [string, string]>>('startEndTimeRange')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const dataType = inject<number>('dataType')!
const barWidth = 12
const platformType = ref('all')
const { data: authorMap } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('yq/taskView/authorMap', {
      cacheFor: 60 * 1000,
      params: {
        dataId: id,
        dataType,
        endTime: startEndTimeRange.value[1],
        platform: platformType.value,
        startTime: startEndTimeRange.value[0],
      },
    }),
  [startEndTimeRange, platformType],
  {
    immediate: true,
    initialData: {},
    sendable: () => {
      return !!startEndTimeRange.value.length && platformType.value !== 'all'
    },
  },
)
const chartData = computed(() => {
  let obj: Record<string, any> = {}

  if (platformType.value === 'all') {
    obj = taskViewData.value.authorMap ?? {}
  } else {
    obj = authorMap.value
  }

  return Object.keys(obj)
    .map((author: string) => {
      return {
        name: author,
        value: obj[author],
      }
    })
    .sort((a: Record<string, any>, b: Record<string, any>) => {
      return b.value - a.value
    })
    .map((item: Record<string, any>, index: number) => {
      return {
        ...item,
        name: `${index + 1}. ${item.name}`,
      }
    })
})
const chartDataMax = computed(() => {
  return Math.max(...chartData.value.map((item: Record<string, any>) => item.value))
})
const halfLength = computed(() => {
  return Math.ceil(chartData.value.length / 2)
})
const height = computed(() => {
  return Math.ceil(
    barWidth * 2.6 * halfLength.value +
      barWidth * 1.2 * Math.max(halfLength.value - 1, 0) +
      padding * 5,
  )
})
const chartOption = computed<OptionType>(() => {
  return {
    backgroundColor: bgColor,
    grid: [
      {
        bottom: padding,
        left: padding,
        outerBoundsMode: 'same',
        right: '52%',
        top: padding * 4,
      },
      {
        bottom: padding,
        left: '52%',
        outerBoundsMode: 'same',
        right: padding,
        top: padding * 4,
      },
    ],
    series: [
      {
        backgroundStyle: {
          borderRadius: 1, // 设置背景的圆角
          color: '#E9EFFF',
        },
        barWidth, // 柱子宽度
        data: chartData.value.slice(0, halfLength.value).map((item: Record<string, any>) => {
          return {
            itemStyle: {
              borderRadius: 1,
              color: '#3FC3E3',
            },
            value: item.value,
          }
        }),
        showBackground: true,
        type: 'bar',
        xAxisIndex: 0,
        yAxisIndex: 0,
      },
      {
        backgroundStyle: {
          borderRadius: 1, // 设置背景的圆角
          color: '#E9EFFF',
        },
        barWidth, // 柱子宽度
        data: chartData.value.slice(halfLength.value, 20).map((item: Record<string, any>) => {
          return {
            itemStyle: {
              borderRadius: 1,
              color: '#3FC3E3',
            },
            value: item.value,
          }
        }),
        showBackground: true,
        type: 'bar',
        xAxisIndex: 1,
        yAxisIndex: 2,
      },
    ],
    title: {
      left: padding,
      text: '活跃作者',
      textStyle: {
        color: '#727476',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
      },
      top: padding,
    },
    xAxis: [
      {
        gridIndex: 0,
        max: chartDataMax.value,
        show: false,
        type: 'value',
      },
      {
        gridIndex: 1,
        max: chartDataMax.value,
        show: false,
        type: 'value',
      },
    ],
    yAxis: [
      {
        axisLabel: {
          align: 'left',
          color: '#727476',
          fontSize: 14,
          inside: true,
          margin: 0,
          padding: [0, 0, 8, 0],
          verticalAlign: 'bottom',
        },
        axisLine: {
          show: false,
        },
        data: chartData.value
          .map((item: Record<string, any>) => item.name)
          .slice(0, halfLength.value),
        gridIndex: 0,
        inverse: true,
      },
      {
        axisLabel: {
          align: 'right',
          color: '#3FC3E3',
          fontSize: 16,
          fontWeight: 700,
          inside: true,
          margin: 0,
          padding: [0, 0, 8, 0],
          verticalAlign: 'bottom',
        },
        axisLine: {
          show: false,
        },
        data: chartData.value
          .map((item: Record<string, any>) => item.value)
          .slice(0, halfLength.value),
        gridIndex: 0,
        inverse: true,
      },
      {
        axisLabel: {
          align: 'left',
          color: '#727476',
          fontSize: 14,
          inside: true,
          margin: 0,
          padding: [0, 0, 8, 0],
          verticalAlign: 'bottom',
        },
        axisLine: {
          show: false,
        },
        data: chartData.value
          .map((item: Record<string, any>) => item.name)
          .slice(halfLength.value, 20),
        gridIndex: 1,
        inverse: true,
      },
      {
        axisLabel: {
          align: 'right',
          color: '#3FC3E3',
          fontSize: 16,
          fontWeight: 700,
          inside: true,
          margin: 0,
          padding: [0, 0, 8, 0],
          verticalAlign: 'bottom',
        },
        axisLine: {
          show: false,
        },
        data: chartData.value
          .map((item: Record<string, any>) => item.value)
          .slice(halfLength.value, 20),
        gridIndex: 1,
        inverse: true,
      },
    ],
  }
})
const platformOptions = computed(() => {
  return [
    {
      label: '所有',
      value: 'all',
    },
    ...useDicOptions('platform').value.map((item) => {
      return {
        label: item.label,
        value: item.label,
      }
    }),
  ]
})
</script>

<template>
  <div class="chart_border">
    <div class="operation">
      <TSelect
        v-model="platformType"
        style="width: 150px"
        :options="platformOptions"
        :clearable="false"
      ></TSelect>
      <TButton class="ml-3!" theme="default" @click="handleDownloadImage">下载图片</TButton>
    </div>
    <VChart
      v-if="isMounted"
      ref="chartRef"
      :option="chartOption"
      style="width: 100%"
      :style="{ height: `${height}px` }"
      :autoresize="true"
    ></VChart>
  </div>
</template>
