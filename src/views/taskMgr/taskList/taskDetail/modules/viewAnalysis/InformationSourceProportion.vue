<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import { saveAs } from 'file-saver'
import VChart from '@/plugins/echarts'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const data = inject<Ref<null | Record<string, any>>>('data')!
const padding = inject<number>('padding')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${data.value!.name}_信息来源占比_${new Date().valueOf()}.png`)
}

const platformOptions = useDicOptions('platform')
const aspectRatioX = inject<number>('aspectRatioX')!
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const colorArr = inject<string[]>('colorArr')!
const bgColor = inject<string>('bgColor')!
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
const chartOption = computed<OptionType>(() => {
  return {
    backgroundColor: bgColor,
    legend: {
      formatter: (name: string) => {
        const value = chartData.value.find((item: Record<string, any>) => item.name === name)!.value

        return `${name}(${value})`
      },
      icon: 'circle',
      itemGap: 20,
      itemHeight: 14,
      itemWidth: 14,
      left: '15%',
      orient: 'vertical',
      textStyle: {
        color: '#727476',
        fontSize: 14,
      },
      top: 'middle',
    },
    series: [
      {
        color: colorArr,
        data: chartData.value,
        label: {
          fontSize: 13,
          formatter: '{b}: {d}%',
        },
        radius: ['50%', '70%'],
        top: padding,
        type: 'pie',
      },
    ],
    title: {
      left: padding,
      text: '信息来源占比',
      textStyle: {
        color: '#727476',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
      },
      top: padding,
    },
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
      :style="{ aspectRatio: `${aspectRatioX}/400` }"
      :autoresize="true"
    ></VChart>
  </div>
</template>
