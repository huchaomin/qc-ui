<script setup lang="ts">
import type { Ref } from 'vue'
import type { OptionType } from '@/plugins/echarts'
import slider from 'img/slider.png?url'
import VChart from '@/plugins/echarts'
import { saveAs } from '@/utils/tool'

const parentData = inject<Ref<null | Record<string, any>>>('data')!
const { data } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('content/contentHotDay/list', {
      params: {
        brandId: parentData.value!.brandId,
        contentId: parentData.value!.contentId,
        pageSize: 10000,
      },
    }),
  [() => parentData.value?.contentId, () => parentData.value?.brandId],
  {
    immediate: true,
    initialData: {},
    sendable: () => {
      return !!parentData.value?.contentId && !!parentData.value?.brandId
    },
  },
)
const isMounted = useMounted()
const chartOption = computed<OptionType>(() => {
  const list = (data.value.rows ?? [])
    .toSorted((a: Record<string, any>, b: Record<string, any>) => {
      return dayjs(a.hotDate).isBefore(dayjs(b.hotDate)) ? -1 : 1
    })
    .map((item: Record<string, any>) => {
      return {
        seriesDataCommentCount: item.commentCount,
        seriesDataHotCount: item.hotCount,
        xAxisData: dayjs(item.hotDate).format('MM-DD'),
      }
    })

  return {
    backgroundColor: '#fff',
    dataZoom: [
      {
        backgroundColor: '#F0F2F5',
        borderColor: 'transparent',
        bottom: 1,
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
        left: 14,
        right: 14,
        show: true,
        start: list.length > 10 ? 50 : 0,
        textStyle: {
          // handle 两边的文字
          color: '#54555A',
        },
        type: 'slider',
      },
      {
        filterMode: 'none',
        type: 'inside',
      },
    ],
    grid: {
      bottom: '60',
      left: '0',
      right: '0',
      top: '50',
    },
    legend: {
      right: 180,
      textStyle: {
        color: '#727476',
        fontSize: 12,
      },
      top: 0,
    },
    series: [
      {
        data: list.map((item: Record<string, any>) => item.seriesDataHotCount),
        name: '热度',
        symbol: 'circle',
        type: 'line',
      },
      {
        data: list.map((item: Record<string, any>) => item.seriesDataCommentCount),
        name: '评论',
        symbol: 'circle',
        type: 'line',
        yAxisIndex: 1,
      },
    ],
    tooltip: {
      axisPointer: {
        lineStyle: {
          color: '#000',
          type: 'solid',
        },
      },
      backgroundColor: 'rgba(101,101,101,0.75)',
      borderWidth: 0,
      textStyle: {
        color: '#fff',
      },
      trigger: 'axis',
    },
    xAxis: {
      axisLine: {
        lineStyle: {
          color: '#e9e9e9',
        },
      },
      axisTick: {
        alignWithLabel: true,
        show: true,
      },
      data: list.map((item: Record<string, any>) => item.xAxisData),
      type: 'category',
    },
    yAxis: [
      {
        name: '热度趋势',
        nameGap: 20,
        nameTextStyle: {
          align: 'right',
          fontSize: 14,
          padding: [0, 8, 0, 0],
        },
        splitLine: {
          lineStyle: {
            color: '#e9e9e9',
            type: 'dashed',
          },
        },
        type: 'value',
      },
      {
        alignTicks: true,
        name: '评论趋势',
        nameGap: 20,
        nameTextStyle: {
          align: 'left',
          fontSize: 14,
          padding: [0, 0, 0, 8],
        },
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

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, '热度和评论趋势.png')
}
</script>

<template>
  <div>
    <div class="mb-2 flex justify-end">
      <TButton theme="default" @click="handleDownloadImage">下载图片</TButton>
    </div>
    <VChart
      v-if="isMounted"
      ref="chartRef"
      :option="chartOption"
      style="width: 100%; aspect-ratio: 1528/400"
      :autoresize="true"
    ></VChart>
  </div>
</template>
