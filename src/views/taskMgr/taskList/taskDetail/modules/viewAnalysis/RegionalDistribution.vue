<script setup lang="ts">
import type { OptionType } from '@/plugins/echarts'
import VChart, { mapFeaturesArr } from '@/plugins/echarts'
import { saveAs } from '@/utils/tool'

const isMounted = useMounted()
const chartRef = ref<InstanceType<typeof VChart> | null>(null)
const parentData = inject<Ref<null | Record<string, any>>>('data')!

function handleDownloadImage(): void {
  const url = chartRef.value!.getDataURL({
    type: 'png',
  })

  saveAs(url, `${parentData.value!.name}_地区分布图_${new Date().valueOf()}.png`)
}

const aspectRatioX = inject<number>('aspectRatioX')!
const { width } = useElementSize(chartRef as unknown as ComponentPublicInstance)
const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!
const bgColor = inject<string>('bgColor')!
const padding = inject<number>('padding')!
const barWidth = 12
const chartData = computed(() => {
  const areaMap = taskViewData.value.areaMap

  if (!areaMap) {
    return []
  }

  return Object.keys(areaMap)
    .map((region: string) => {
      return { name: region, value: areaMap[region] }
    })
    .sort((a, b) => b.value - a.value)
})
// const chartData = computed(() => {
//   const arr = []
//   for (const item of mapFeaturesArr) {
//     const name = item.name
//     const result = chartDataPre.value.find((item) => name.includes(item.name))
//     if (result !== undefined) {
//       arr.push({
//         name: result.name,
//         value: result.value,
//       })
//     } else {
//       arr.push({
//         name,
//         value: 1,
//       })
//     }
//   }
//   return arr.splice(0, 5)
// })
const aspectRatioY = computed(() => {
  return (400 / 10) * Math.max(chartData.value.length, 18)
})
const mapNameMap = computed(() => {
  const map: Record<string, string> = {}

  for (const item of mapFeaturesArr) {
    const name = item.name
    const sourceName = chartData.value.find((item) => name.includes(item.name))?.name

    if (sourceName !== undefined) {
      map[name] = sourceName
    }
  }

  return map
})
const scatterData = computed(() => {
  const arr: Array<{
    data: [number, number, number]
    name: string
  }> = []

  for (const item of mapFeaturesArr) {
    const name = item.name
    const result = chartData.value.find((item) => name.includes(item.name))

    if (result !== undefined) {
      arr.push({
        data: [item.center[0], item.center[1], result.value],
        name,
      })
    }
  }

  return arr.sort((a, b) => a.data[2] - b.data[2])
})
const showScatter = ref(false)
const chartOption = computed<OptionType>(() => {
  const chartWidth = width.value
  const maxValue = Math.max(...chartData.value.map((item) => item.value))
  const minValue = Math.min(...chartData.value.map((item) => item.value))

  return {
    backgroundColor: bgColor,
    geo: {
      left: padding,
      map: 'china',
      right: '50%',
      show: false,
      ...(chartData.value.length > 25
        ? {}
        : {
            top: padding,
          }),
    },
    grid: [
      {
        bottom: padding,
        left: '50%',
        outerBoundsMode: 'same',
        right: padding,
        top: padding * 4,
      },
    ],
    series: [
      {
        left: padding,
        map: 'china',
        type: 'map',
        ...(chartData.value.length > 25
          ? {}
          : {
              top: padding,
            }),
        data: chartData.value,
        emphasis: {
          label: {
            show: false,
          },
        },
        nameMap: mapNameMap.value,
        right: '50%',
        silent: showScatter.value,
        tooltip: {
          extraCssText: 'border-radius: 15px; padding: 4px 8px; background-color: #fff;',
          formatter: ({ name, value }: any) => {
            if (Number.isNaN(value)) {
              return ''
            }

            return `${name}：${value}`
          },
          show: true,
        },
      },
      ...(showScatter.value
        ? ([
            {
              coordinateSystem: 'geo',
              data: scatterData.value.map((item) => item.data),
              itemStyle: {
                color: '#47c4e3',
              },
              label: {
                color: '#000',
                formatter({ value }: { value: any }) {
                  return value[2]
                },
                show: false,
              },
              symbol: 'pin', // 气泡
              symbolSize: (arr: any) => {
                const size = arr[2]
                const radio = chartWidth / 1200
                const minSize = 24 * radio
                const maxSize = 60 * radio
                const sizeRange = maxSize - minSize
                const sizeRatio = (size - minValue) / (maxValue - minValue)
                const calcSize = minSize + sizeRatio * sizeRange

                return Math.round(calcSize)
              },
              tooltip: {
                extraCssText: 'border-radius: 15px; padding: 4px 8px; background-color: #fff;',
                formatter: ({ dataIndex }: { dataIndex: number }) => {
                  return `${scatterData.value[dataIndex]!.name}: ${scatterData.value[dataIndex]!.data[2]}`
                },
                show: true,
              },
              type: 'scatter',
            },
          ] as const)
        : []),
      {
        backgroundStyle: {
          borderRadius: 1, // 设置背景的圆角
          color: '#E9EFFF',
        },
        barWidth,
        data: chartData.value.map((item) => {
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
      },
    ],
    title: {
      left: padding,
      text: '地区分布图',
      textStyle: {
        color: '#727476',
        fontFamily: 'Roboto, sans-serif',
        fontSize: 16,
        fontWeight: 'bold',
      },
      top: padding,
    },
    tooltip: {
      show: false,
      trigger: 'item',
    },
    visualMap: [
      {
        bottom: padding,
        inRange: {
          // https://photokit.com/colors/color-gradient/?lang=zh
          color: [
            ...(showScatter.value ? [] : ['#ffffff', '#ebf8fc', '#d6f2f9', '#c2ebf6']),
            '#ade5f3',
            '#99deef',
            '#84d8ec',
            '#70d1e9',
            '#5bcbe6',
            '#47c4e3',
          ],
        },
        itemHeight: chartWidth * 0.08,
        itemWidth: chartWidth * 0.015,
        left: padding,
        max: chartData.value.length > 0 ? maxValue : 99,
        min: 0,
        padding: [0, 0, 0, 0],
        seriesIndex: showScatter.value ? [1] : [0],
        // show: !showScatter.value,
        type: 'continuous',
      },
    ],
    xAxis: [
      {
        show: false,
        type: 'value',
      },
    ],
    yAxis: [
      {
        axisLabel: {
          color: '#727476',
          fontSize: 14,
        },
        axisLine: {
          show: false,
        },
        data: chartData.value.map((item) => item.name),
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
        data: chartData.value.map((item) => item.value),
        inverse: true,
      },
    ],
  }
})
</script>

<template>
  <div class="chart_border">
    <div
      class="flex items-center"
      style="position: absolute; left: 22%; z-index: 1"
      :style="{ top: `${padding}px` }"
    >
      <TSwitch v-model="showScatter" size="large">
        <template #label="slotProps">{{ slotProps.value ? '开' : '关' }}</template>
      </TSwitch>
      <span class="ml-2">气泡</span>
    </div>
    <div class="operation">
      <TButton theme="default" @click="handleDownloadImage">下载图片</TButton>
    </div>
    <VChart
      v-if="isMounted"
      ref="chartRef"
      :option="chartOption"
      style="width: 100%"
      :style="{ aspectRatio: `${aspectRatioX}/${aspectRatioY}` }"
      :autoresize="true"
    ></VChart>
  </div>
</template>
