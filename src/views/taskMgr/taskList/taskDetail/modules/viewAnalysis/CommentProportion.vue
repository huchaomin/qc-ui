<script setup lang="ts">
import type { Ref } from 'vue'
import type { OptionType } from '@/plugins/echarts'
import VChart from '@/plugins/echarts'
import { saveAs } from '@/utils/tool'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const bgColor = inject<string>('bgColor')!
const parentData = inject<Ref<null | Record<string, any>>>('data')!
const padding = inject<number>('padding')!
const id = inject<string>('id')!
const startEndTimeRange = inject<Ref<[] | [string, string]>>('startEndTimeRange')!
const dataType = inject<number>('dataType')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${parentData.value!.name}_情感占比_${new Date().valueOf()}.png`)
}

const aspectRatioX = inject<number>('aspectRatioX')!
const moodLevelOptions = useDicOptions('mood_level')
const { data: commentCountMap } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('yq/taskView/commentCount', {
      cacheFor: 60 * 1000,
      params: {
        dataId: id,
        dataType,
        endTime: startEndTimeRange.value[1],
        startTime: startEndTimeRange.value[0],
      },
      timeout: 0,
    }),
  [startEndTimeRange],
  {
    immediate: true,
    initialData: {},
    sendable: () => {
      return !!startEndTimeRange.value.length
    },
  },
)
const chartData = computed(() => {
  const moodMap = commentCountMap.value.moodMap

  if (!moodMap) {
    return []
  }

  return Object.keys(moodMap)
    .sort((a: string, b: string) => {
      return Number(b) - Number(a)
    })
    .map((moodLevel: string) => {
      return {
        name:
          moodLevelOptions.value.find((item: Record<string, any>) => item.value === moodLevel)
            ?.label ?? '',
        value: moodMap[moodLevel],
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
      text: '评论占比',
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

watch(commentCountMap, (val) => {
  moodType.value = ''

  const moodMap = val.moodMap

  if (!moodMap) {
    return
  }

  for (const moodLevel of ['1', '0', '-1']) {
    if (moodMap[moodLevel]) {
      moodType.value = moodLevel
      break
    }
  }
})

const tableData = computed(() => {
  if (moodType.value === '') {
    return []
  }

  const obj = commentCountMap.value.moodCommentGroupNum[moodType.value] ?? {}

  return Object.keys(obj)
    .map((keyWord: string) => {
      return {
        count: obj[keyWord],
        keyWord,
      }
    })
    .sort((a: Record<string, any>, b: Record<string, any>) => {
      return b.count - a.count
    })
})
const columns: TableCol[] = [
  {
    colKey: 'keyWord',
    title: '关键词',
  },
  {
    colKey: 'count',
    title: '出现次数',
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
        <div style="font-size: 16px; font-weight: bold; color: #727476">
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
        <TTable
          :show-serial-number="false"
          :data="tableData"
          :columns="columns"
          flex-height
        ></TTable>
      </div>
    </div>
  </div>
</template>
