<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import { saveAs } from 'file-saver'
import VChart from '@/plugins/echarts'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const bgColor = inject<string>('bgColor')!
const data = inject<Ref<null | Record<string, any>>>('data')!
const padding = inject<number>('padding')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${data.value!.name}_情感占比_${new Date().valueOf()}.png`)
}

const aspectRatioX = inject<number>('aspectRatioX')!
const moodLevelOptions = useDicOptions('mood_level')
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const chartData = computed(() => {
  const moodRateTrend = taskViewData.value.moodRateTrend

  if (!moodRateTrend) {
    return []
  }

  return Object.keys(moodRateTrend)
    .sort((a: string, b: string) => {
      return Number(b) - Number(a)
    })
    .map((moodLevel: string) => {
      return {
        name:
          moodLevelOptions.value.find((item: Record<string, any>) => item.value === moodLevel)
            ?.label ?? '',
        value: moodRateTrend[moodLevel].moodNum,
      }
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
      itemGap: 30,
      itemHeight: 14,
      itemWidth: 14,
      left: '4%',
      orient: 'vertical',
      textStyle: {
        color: '#727476',
        fontSize: 14,
      },
      top: 'middle',
    },
    series: [
      {
        center: ['60%', '50%'],
        color: ['#60C4E2', '#FFCD33', '#FA7F7B'],
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
      text: '情感占比',
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
const moodType = ref('')

watch(
  taskViewData,
  (val) => {
    moodType.value = ''

    const moodRateTrend = val.moodRateTrend

    if (!moodRateTrend) {
      return
    }

    for (const moodLevel of ['1', '0', '-1']) {
      if (moodRateTrend[moodLevel]) {
        moodType.value = moodLevel
        break
      }
    }
  },
  {
    immediate: true,
  },
)

const tableData = computed(() => {
  if (moodType.value === '') {
    return []
  }

  return taskViewData.value.moodRateTrend[moodType.value]?.videoAnalysisDtoList ?? []
})
const columns: TableCol[] = [
  {
    ...useVideoTitleColumn(),
    resize: {
      maxWidth: 470,
    },
  },
  {
    colKey: 'publishTime',
    title: '发布时间',
  },
]
</script>

<template>
  <div class="chart_border grid grid-cols-2">
    <div style="position: relative; height: fit-content">
      <div class="operation">
        <TButton theme="default" @click="handleDownloadImage">下载图片</TButton>
      </div>
      <VChart
        v-if="isMounted"
        ref="chartRef"
        :option="chartOption"
        style="width: 100%"
        :style="{ aspectRatio: `${aspectRatioX / 2}/400` }"
        :autoresize="true"
      ></VChart>
    </div>
    <div
      style="overflow: hidden"
      :style="{ aspectRatio: `${aspectRatioX / 2}/400` }"
      class="flex flex-col p-3"
    >
      <div class="mb-3 flex items-center">
        <div style="font-size: 16px; font-weight: bold">
          {{ useDicLabel('mood_level', moodType) }}信息TOP20
        </div>
        <TSelect
          v-model="moodType"
          style="width: 100px"
          dic-code="mood_level"
          :clearable="false"
          class="ml-auto"
        ></TSelect>
      </div>
      <div class="flex flex-1 flex-col" style="overflow: hidden">
        <TTable :data="tableData" :columns="columns" flex-height></TTable>
      </div>
    </div>
  </div>
</template>
