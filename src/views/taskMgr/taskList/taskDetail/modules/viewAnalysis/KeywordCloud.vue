<!-- https://wordcloud2-js.timdream.org/#love -->
<script setup lang="ts">
import WordCloud from 'wordcloud'
import { saveAs } from '@/utils/tool'

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

watchThrottled(
  [width, chartData],
  () => {
    nextTick(() => {
      WordCloud(wordCloudRef.value as unknown as HTMLElement, {
        backgroundColor: bgColor,
        color: () => {
          const arr = ['#147FA0', '#3FC3E3', '#AFCA58']

          return arr[Math.floor(Math.random() * arr.length)]!
        },
        fontFamily: '"Microsoft YaHei", sans-serif',
        list: chartData.value.sort((a, b) => (b[1] - a[1] > 0 ? 1 : -1)),
        rotateRatio: 0,
        // https://wordcloud2-js.timdream.org/shape-generator.html
        shape: (theta: number) => {
          const max = 91
          const leng = [
            /* eslint-disable antfu/consistent-list-newline */
            76, 76, 75, 74, 75, 73, 72, 71, 70, 68, 69, 65, 66, 62, 63, 60, 56, 55, 55, 57, 56, 57,
            56, 57, 56, 56, 55, 56, 57, 56, 57, 56, 57, 57, 57, 58, 57, 58, 58, 57, 58, 57, 58, 59,
            58, 57, 58, 59, 58, 59, 58, 59, 58, 59, 58, 59, 59, 59, 58, 59, 60, 59, 58, 59, 60, 59,
            60, 59, 59, 59, 58, 59, 60, 59, 60, 60, 59, 60, 59, 60, 59, 60, 60, 59, 60, 59, 60, 61,
            59, 60, 60, 59, 60, 59, 60, 61, 59, 59, 60, 59, 60, 59, 59, 59, 60, 58, 59, 59, 60, 59,
            60, 59, 58, 59, 58, 59, 58, 59, 58, 58, 59, 58, 59, 58, 59, 57, 57, 58, 58, 59, 58, 57,
            58, 57, 58, 57, 58, 57, 57, 57, 56, 57, 56, 56, 57, 56, 57, 56, 57, 56, 57, 56, 55, 56,
            55, 56, 55, 56, 55, 55, 56, 54, 55, 54, 55, 54, 55, 53, 54, 53, 54, 52, 53, 52, 53, 51,
            52, 52, 52, 51, 52, 51, 52, 50, 51, 50, 50, 50, 51, 50, 49, 51, 49, 50, 49, 48, 50, 48,
            50, 49, 48, 49, 48, 47, 48, 47, 48, 50, 47, 46, 47, 46, 45, 47, 46, 45, 46, 46, 45, 44,
            45, 45, 44, 45, 46, 44, 44, 43, 44, 44, 43, 44, 42, 43, 44, 42, 44, 44, 46, 47, 48, 48,
            49, 49, 51, 51, 52, 53, 54, 55, 56, 55, 55, 56, 57, 57, 57, 58, 59, 58, 59, 60, 59, 60,
            61, 60, 60, 61, 61, 62, 61, 62, 62, 63, 64, 62, 63, 64, 63, 63, 63, 63, 64, 64, 64, 63,
            64, 64, 64, 65, 63, 64, 65, 64, 65, 66, 67, 67, 68, 69, 70, 70, 72, 73, 73, 74, 75, 75,
            76, 77, 77, 78, 79, 80, 81, 81, 81, 82, 82, 83, 84, 83, 84, 84, 84, 85, 85, 85, 86, 87,
            87, 87, 87, 87, 87, 87, 88, 88, 88, 89, 88, 89, 89, 89, 89, 90, 89, 89, 90, 90, 89, 90,
            90, 89, 90, 90, 89, 89, 89, 89, 89, 89, 89, 89, 88, 88, 88, 88, 87, 88, 87, 87, 87, 86,
            86, 85, 86, 85, 84, 84, 83, 83, 82, 83, 82, 81, 81, 81, 80, 79, 78, 77, 77, 77, 76, 77,
            75, 74, 73, 73, 72, 73, 71, 70, 71, 69, 69, 68, 68, 67, 68, 66, 67, 65, 65, 66, 64, 64,
            63, 63, 64, 62, 62, 63, 61, 61, 62, 60, 60, 61, 60, 59, 59, 60, 59, 58, 59, 58, 59, 57,
            57, 58, 57, 58, 57, 56, 57, 56, 57, 56, 57, 56, 56, 56, 55, 56, 55, 55, 56, 55, 56, 55,
            56, 55, 56, 55, 55, 56, 55, 56, 55, 56, 55, 56, 55, 55, 56, 55, 56, 55, 56, 55, 55, 56,
            55, 56, 55, 56, 55, 56, 55, 56, 57, 56, 57, 56, 57, 56, 57, 58, 57, 57, 58, 57, 59, 58,
            58, 59, 58, 59, 60, 59, 60, 60, 60, 61, 61, 61, 62, 61, 62, 62, 63, 64, 63, 64, 65, 64,
            65, 65, 66, 67, 66, 67, 68, 68, 69, 70, 70, 70, 71, 71, 72, 73, 73, 74, 75, 75, 76, 77,
            77, 78, 79, 79, 80, 80, 81, 82, 82, 83, 83, 84, 85, 85, 85, 86, 86, 86, 87, 88, 87, 88,
            88, 89, 88, 89, 90, 89, 90, 89, 90, 89, 90, 91, 90, 90, 91, 90, 91, 90, 91, 90, 90, 90,
            90, 91, 90, 91, 90, 89, 89, 89, 89, 88, 88, 88, 88, 87, 87, 87, 88, 86, 87, 86, 85, 84,
            84, 83, 83, 82, 82, 81, 82, 81, 80, 79, 78, 79, 78,
            /* eslint-enable antfu/consistent-list-newline */
          ]

          return leng[((theta / (2 * Math.PI)) * leng.length) | 0]! / max
        },
        weightFactor(size) {
          const radio = width.value / 600
          // 定义最小和最大字体大小
          const minFontSize = 12 * radio
          const maxFontSize = 50 * radio
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
