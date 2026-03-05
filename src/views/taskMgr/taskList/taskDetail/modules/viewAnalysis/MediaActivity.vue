<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import { saveAs } from 'file-saver'
import VChart from '@/plugins/echarts'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const parentData = inject<Ref<null | Record<string, any>>>('data')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${parentData.value!.name}_媒体活跃度_${new Date().valueOf()}.png`)
}

const platformOptions = useDicOptions('platform')
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const barWidth = 12
const chartData = computed(() => {
  const platformRateTrend = taskViewData.value.platformRateTrend

  if (!platformRateTrend) {
    return []
  }

  return Object.keys(platformRateTrend)
    .map((platform: string) => {
      return {
        name:
          platformOptions.value.find((item: Record<string, any>) => item.value === platform)
            ?.label ?? platform,
        value: platformRateTrend[platform],
      }
    })
    .sort((a: Record<string, any>, b: Record<string, any>) => {
      return b.value - a.value
    })
})
const height = computed(() => {
  return Math.ceil(
    barWidth * 2.3 * chartData.value.length +
      barWidth * 1.2 * Math.max(chartData.value.length - 1, 0) +
      padding * 5,
  )
})
const chartOption = computed<OptionType>(() => {
  return {
    backgroundColor: bgColor,
    grid: {
      bottom: padding,
      left: padding,
      outerBoundsMode: 'same',
      right: padding,
      top: padding * 4,
    },
    series: [
      {
        backgroundStyle: {
          borderRadius: 1, // 设置背景的圆角
          color: '#E9EFFF',
        },
        barWidth, // 柱子宽度
        data: chartData.value
          .map((item: Record<string, any>) => item.value)
          .map((item) => {
            return {
              itemStyle: {
                borderRadius: 1,
                color: '#3FC3E3',
              },
              value: item,
            }
          }),
        showBackground: true,
        type: 'bar',
      },
    ],
    title: {
      left: padding,
      text: '媒体活跃度',
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
        data: chartData.value.map((item: Record<string, any>) => item.name),
        inverse: true,
      },
      {
        axisLabel: {
          color: '#3FC3E3',
          fontSize: 16,
          fontWeight: 700,
          margin: 10,
        },
        axisLine: {
          show: false,
        },
        data: chartData.value.map((item: Record<string, any>) => item.value),
        inverse: true,
      },
    ],
  }
})
</script>

<template>
  <div class="chart_border">
    <div class="operation">
      <TButton theme="default" @click="handleDownloadImage">下载图片</TButton>
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
