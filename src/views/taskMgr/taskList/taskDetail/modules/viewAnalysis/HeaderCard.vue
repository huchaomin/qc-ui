<script setup lang="ts">
import type { PresetRange } from 'tdesign-vue-next'
import type { Ref } from 'vue'
import SelectCanvas from './SelectCanvas.vue'

withDefaults(
  defineProps<{
    modelValue: [] | [string, string]
  }>(),
  {},
)

const emit = defineEmits<{
  'update:modelValue': [modelValue: [] | [string, string]]
}>()
const id = inject<string>('id')!
const parentData = inject<Ref<null | Record<string, any>>>('data')!
const dataType = inject<number>('dataType')!
// 只有事件详情才有时间范围限制
const limitTimeRange = inject<Ref<[] | [string, string]>>('limitTimeRange', ref([]))
const dateTimeRange = ref<[] | [string, string]>([])
const showCommentProportion = inject<Ref<boolean>>('showCommentProportion')!

watch(
  limitTimeRange,
  () => {
    if (limitTimeRange.value[0] !== undefined) {
      // const [start, end] = limitTimeRange.value
      // const shortThan1Week = dayjs(end).isBefore(dayjs(start).add(1, 'week'))
      // dateTimeRange.value = [
      //   (shortThan1Week ? dayjs(start) : dayjs(end).subtract(1, 'week'))
      //     .startOf('day')
      //     .format('YYYY-MM-DD HH:mm:ss'),
      //   dayjs(end).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      // ]
      dateTimeRange.value = [
        dayjs(limitTimeRange.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
        dayjs(limitTimeRange.value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
    } else {
      dateTimeRange.value = [
        dayjs().startOf('day').subtract(1, 'week').format('YYYY-MM-DD HH:mm:ss'),
        dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
      ]
    }

    // if (limitTimeRange.value[0] !== undefined) {
    //   dateTimeRange.value = [
    //     dayjs(limitTimeRange.value[0]).startOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //     dayjs(limitTimeRange.value[1]).endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //   ]
    // } else {
    //   dateTimeRange.value = [
    //     dayjs().startOf('day').subtract(60, 'day').format('YYYY-MM-DD HH:mm:ss'),
    //     dayjs().endOf('day').format('YYYY-MM-DD HH:mm:ss'),
    //   ]
    // }
  },
  {
    immediate: true,
  },
)

const presets: PresetRange = {
  '24小时': [dayjs().subtract(24, 'hour').toDate(), dayjs().toDate()],
  当天: [dayjs().startOf('day').toDate(), dayjs().endOf('day').toDate()],
  最近一周: [dayjs().startOf('day').subtract(1, 'week').toDate(), dayjs().endOf('day').toDate()],
}

watch(
  dateTimeRange,
  (val) => {
    emit('update:modelValue', val)
  },
  {
    immediate: true,
  },
)

const taskViewData = inject<Ref<Record<string, any>>>('taskViewData')!

async function handleDataDownload(): Promise<void> {
  await alovaInst.Post(
    'yq/taskView/exportData',
    {
      dataId: id,
      dataType,
      endTime: dateTimeRange.value[1],
      startTime: dateTimeRange.value[0],
    },
    {
      meta: {
        useDownload: `任务视图分析数据_${Date.now()}.xlsx`,
        useResponseBlob: true,
      },
    },
  )
}

const headerCardRef = ref<HTMLElement | null>(null)

function handleReportGenerate(): void {
  const parentElement = headerCardRef.value!.parentElement
  const canvasList = [...parentElement!.querySelectorAll('canvas')!]
  const selectCanvasRef = ref<InstanceType<typeof SelectCanvas> | null>(null)

  void $confirm({
    body: () =>
      h(SelectCanvas, {
        canvasList,
        data: parentData.value!,
        id,
        ref: selectCanvasRef,
        reqContent: `热度：${Number(taskViewData.value.hotCount ?? 0)};互动量：${Number(taskViewData.value.interactNum ?? 0)};评论数：${Number(taskViewData.value.commentCount ?? 0)};`,
      }),
    header: '生成报告',
    onConfirmCallback: async () => {
      await selectCanvasRef.value!.handleSubmit()
    },
    width: 1200, // 730
  })
}
</script>

<template>
  <div ref="headerCardRef" class="mb-4">
    <div class="mb-4 flex items-center">
      <div style="font-size: 16px; font-weight: bold">分析总览</div>
      <TCheckbox v-model="showCommentProportion" class="ml-auto!" label="显示评论占比"></TCheckbox>
      <span class="ml-3">分析时间：</span>
      <TDateRangePicker
        v-model="dateTimeRange"
        :presets="limitTimeRange[0] !== undefined ? {} : presets"
        :clearable="false"
        :enable-time-picker="true"
        :disable-date="
          limitTimeRange.length > 0
            ? {
                before: limitTimeRange[0],
                after: limitTimeRange[1],
              }
            : undefined
        "
      ></TDateRangePicker>
      <TButton class="ml-3!" theme="default" @click="handleDataDownload">下载分析数据</TButton>
      <TButton theme="default" @click="handleReportGenerate">舆情报告生成</TButton>
    </div>
    <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
      <TCard title="热度" :header-bordered="false" body-class-name="pt-0!">
        <TStatistic :value="Number(taskViewData.hotCount ?? 0)"></TStatistic>
      </TCard>
      <TCard title="互动量" :header-bordered="false" body-class-name="pt-0!">
        <TStatistic :value="Number(taskViewData.interactNum ?? 0)"></TStatistic>
      </TCard>
      <TCard title="评论数" :header-bordered="false" body-class-name="pt-0!">
        <TStatistic :value="Number(taskViewData.commentCount ?? 0)"></TStatistic>
      </TCard>
    </div>
  </div>
</template>
