<!-- https://wordcloud2-js.timdream.org/#love -->
<script setup lang="ts">
import type { Ref } from 'vue'
import WordCloud from 'wordcloud'
import { saveAs } from '@/utils/tool'
import shapeArr from './shape'

const parentData = inject<Ref<null | Record<string, any>>>('data')!
const wordCloudRef = ref<HTMLCanvasElement | null>(null)

function handleDownloadImage(): void {
  const url = wordCloudRef.value!.toDataURL('image/png')

  saveAs(url, `${parentData.value!.name}_关键词云_${new Date().valueOf()}.png`)
}

const aspectRatioX = inject<number>('aspectRatioX')!
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const chartData = computed<Array<[string, number]>>(() => {
  const wordCloudMap = taskViewData.value.wordCloudMap

  if (!wordCloudMap) {
    return []
  }

  return Object.keys(wordCloudMap).map((keyword: string) => {
    return [keyword, wordCloudMap[keyword]]
  })
})
const wordCloudContainerRef = ref<HTMLDivElement>()
const { height, width } = useElementSize(wordCloudContainerRef)

function wordcloudstop(): void {
  const ctx = wordCloudRef.value!.getContext('2d')!

  ctx.font = 'bold 16px Roboto,sans-serif'
  ctx.textAlign = 'left' // 水平左对齐
  ctx.textBaseline = 'top' // 垂直顶部对齐
  ctx.fillStyle = '#727476'
  ctx.fillText('关键词云', padding + 4, padding + 4)
}

const shape = ref('cloud')

watchThrottled(
  [width, chartData, shape],
  () => {
    nextTick(() => {
      WordCloud(wordCloudRef.value as unknown as HTMLElement, {
        backgroundColor: bgColor,
        color: (word) => {
          const weightArr = chartData.value.map((item) => item[1])
          const max = Math.max(...weightArr)
          const min = Math.min(...weightArr)
          const range = max - min + 1
          const separate1 = min + range / 3
          const separate2 = min + (range * 2) / 3
          const wordWeight = chartData.value.find((item) => item[0] === word)![1]

          if (Number(wordWeight) < separate1) {
            return '#F29920'
          } else if (Number(wordWeight) < separate2) {
            return '#3378C8'
          } else {
            return '#19457F'
          }
        },
        fontFamily: '"Microsoft YaHei", sans-serif',
        list: chartData.value.sort((a, b) => (b[1] - a[1] > 0 ? 1 : -1)), // 大字体先渲染
        rotateRatio: 0,
        // https://wordcloud2-js.timdream.org/shape-generator.html
        shape: (theta: number) => {
          return shapeArr.find((item) => item.value === shape.value)!.shape(theta)
        },
        weightFactor(size) {
          const radio = width.value / 600
          // 定义最小和最大字体大小
          const minFontSize = 11 * radio
          const maxFontSize = 32 * radio
          // 计算字体大小范围
          const fontSizeRange = maxFontSize - minFontSize
          const weightRatio =
            (size - Math.min(...chartData.value.map((item) => item[1]))) /
            Math.max(...chartData.value.map((item) => item[1]))
          const fontSize = minFontSize + weightRatio * fontSizeRange

          return Math.round(fontSize)
        },
      })
    })
  },
  { throttle: 500 },
)

const tableData = computed(() => {
  const wordCloudMap = taskViewData.value.wordCloudMap

  if (!wordCloudMap) {
    return []
  }

  return Object.keys(wordCloudMap)
    .map((keyword: string) => {
      return {
        num: wordCloudMap[keyword],
        word: keyword,
      }
    })
    .sort((a, b) => b.num - a.num)
})
const columns: TableCol[] = [
  {
    colKey: 'serial-number',
    title: '排名',
  },
  {
    colKey: 'word',
    title: '热词',
  },
  {
    colKey: 'num',
    title: '提及量',
  },
]
</script>

<template>
  <div class="chart_border grid grid-cols-2">
    <div style="position: relative; height: fit-content">
      <div class="operation">
        <TSelect
          v-model="shape"
          style="width: 100px"
          class="mr-3!"
          :clearable="false"
          :options="shapeArr"
        ></TSelect>
        <TButton theme="default" @click="handleDownloadImage">下载图片</TButton>
      </div>
      <div
        ref="wordCloudContainerRef"
        style="overflow: hidden"
        :style="{ aspectRatio: `${aspectRatioX / 2}/400` }"
      >
        <canvas
          ref="wordCloudRef"
          style="display: block"
          :width="width"
          :height="height"
          @wordcloudstop="wordcloudstop"
        ></canvas>
      </div>
    </div>
    <div
      style="overflow: hidden"
      :style="{ aspectRatio: `${aspectRatioX / 2}/400` }"
      class="flex flex-col p-3"
    >
      <div
        class="mb-3"
        style="font-size: 16px; font-weight: bold; line-height: 32px; color: #727476"
      >
        热门词频
      </div>
      <div class="flex flex-1 flex-col" style="overflow: hidden">
        <TTable :data="tableData" :columns="columns" flex-height></TTable>
      </div>
    </div>
  </div>
</template>
