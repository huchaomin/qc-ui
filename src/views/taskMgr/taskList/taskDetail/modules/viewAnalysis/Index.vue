<script setup lang="ts">
// import ActiveAuthors from './ActiveAuthors.vue'
import EmotionalProportion from './EmotionalProportion.vue'
import HeaderCard from './HeaderCard.vue'
import InformationSourceProportion from './InformationSourceProportion.vue'
import InfoSourceTrend from './InfoSourceTrend.vue'
// import InteractiveVolumeTrend from './InteractiveVolumeTrend.vue'
import KeywordCloud from './KeywordCloud.vue'
// import MediaActivity from './MediaActivity.vue'
// import RegionalDistribution from './RegionalDistribution.vue'
import SentimentTrend from './SentimentTrend.vue'

const id = inject<string>('id')!
const dataType = inject<number>('dataType')!
const startEndTimeRange = ref<[] | [string, string]>([])
const { data: taskViewData } = useWatcher(
  () =>
    alovaInst.Get<Record<string, any>>('yq/taskView/getTaskView', {
      params: {
        dataId: id,
        dataType,
        endTime: startEndTimeRange.value[1],
        startTime: startEndTimeRange.value[0],
      },
    }),
  [startEndTimeRange],
  {
    initialData: {},
    sendable: () => {
      return !!startEndTimeRange.value.length
    },
  },
)
const bgColor = '#f7ffff'
const padding = 12

provide('bgColor', bgColor)
provide('padding', padding)
provide('id', id)
provide('startEndTimeRange', startEndTimeRange)
provide('aspectRatioX', 1800)
provide('taskViewData', taskViewData)
provide('colorArr', [
  '#6DAFFE',
  '#ED837F',
  '#4DD2A0',
  '#EE9133',
  '#E772B1',
  '#727476',
  '#FFCD33',
  '#60C4E2',
])
</script>

<template>
  <div>
    <HeaderCard v-model="startEndTimeRange"></HeaderCard>
    <InfoSourceTrend></InfoSourceTrend>
    <SentimentTrend></SentimentTrend>
    <EmotionalProportion></EmotionalProportion>
    <InformationSourceProportion></InformationSourceProportion>
    <KeywordCloud></KeywordCloud>
    <!-- <MediaActivity></MediaActivity> -->
    <!-- <ActiveAuthors></ActiveAuthors> -->
    <!-- <RegionalDistribution></RegionalDistribution> -->
    <!-- <InteractiveVolumeTrend></InteractiveVolumeTrend> -->
  </div>
</template>

<style scoped>
:deep() {
  .chart_border {
    position: relative;
    background-color: v-bind(bgcolor);
    border: 1px dashed #e0e0e0;

    .operation {
      position: absolute;
      top: calc(v-bind(padding) * 1px);
      right: calc(v-bind(padding) * 1px);
      z-index: 1;
      display: flex;
      align-items: center;
    }

    .vxe-table--body {
      background-color: v-bind(bgcolor);
    }

    &:not(:last-of-type) {
      margin-bottom: 24px;
    }
  }
}
</style>
