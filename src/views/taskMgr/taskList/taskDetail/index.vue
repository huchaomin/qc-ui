<script setup lang="ts">
import TaskDetail from './modules/TaskDetail.vue'
import ViewAnalysis from './modules/ViewAnalysis.vue'

const route = useRoute()
const id = route.query.id as string
const { data, send } = useRequest(alovaInst.Get<Record<string, any> | undefined>(`yq/task/${id}`), {
  initialData: undefined,
})
const monitorPhraseLabels = computed(() => {
  if (typeof data.value?.monitorPhraseIds === 'string') {
    return useListLabel('monitorPhrase', data.value.monitorPhraseIds.split(',').filter(Boolean))
      .value
  }

  return []
})
const tabs = [
  {
    component: markRaw(TaskDetail),
    label: '任务详情',
    value: 'taskDetail',
  },
  {
    component: markRaw(ViewAnalysis),
    label: '任务视图分析',
    value: 'viewAnalysis',
  },
]
const tab = ref(tabs[0]!.value)

provide('id', id)
provide('data', data)
provide('dataType', 1)
</script>

<template>
  <div>
    <TCard v-if="data" :title="`任务名称：${data.name}`">
      <template #actions>
        <TTag :theme="data.runStatus === 0 ? 'success' : 'danger'">
          {{ useDicLabel('run_status', data.runStatus) }}
        </TTag>
      </template>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        <div>
          <span class="text-(--td-text-color-placeholder)">品牌：</span>
          <span>{{ useListLabel('brand', data.brandId) }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">搜索词组：</span>
          <TTag v-for="str in monitorPhraseLabels" :key="str">{{ str }}</TTag>
        </div>
        <div class="flex items-center">
          <span class="text-(--td-text-color-placeholder)">搜索词名称：</span>
          <TTypographyText
            :ellipsis="{
              tooltipProps: {
                content: data.monitorWords,
              },
            }"
            class="my-0! flex-1"
            >{{ data.monitorWords }}</TTypographyText
          >
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">当前搜索词：</span>
          <span>{{ data.currentSearchWord }}</span>
        </div>

        <div>
          <span class="text-(--td-text-color-placeholder)">最近执行开始时间：</span>
          <span>{{ data.lastRunStartTime }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">最近执行完成时间：</span>
          <span>{{ data.lastRunEndTime }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">搜索频次：</span>
          <span>{{ data.searchFrequency }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">执行次数：</span>
          <span>{{ data.execNum }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">监控信息数量：</span>
          <span>{{ data.monitorVideoNum }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">文件大小：</span>
          <span>{{ data.monitorFileTotal }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">优先级：</span>
          <span>{{ data.priority }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">数据截止时间：</span>
          <span>{{ data.deadlineTime }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">是否使用品牌视频媒体池：</span>
          <span>{{ useDicLabel('sys_yes_no', data.useBrandWx) }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">状态：</span>
          <TTag :theme="data.status === 0 ? 'success' : 'danger'">
            {{ useDicLabel('status', data.status) }}
          </TTag>
        </div>
      </div>
    </TCard>
    <TCard class="mt-4!">
      <TTabs v-model="tab" size="large" class="-mt-4!">
        <TTabPanel v-for="item in tabs" :key="item.value" :value="item.value" :label="item.label">
          <Component :is="item.component" class="mt-4!" @update="send"></Component>
        </TTabPanel>
      </TTabs>
    </TCard>
  </div>
</template>
