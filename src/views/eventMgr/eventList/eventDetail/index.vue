<script setup lang="ts">
import EventDetail from './modules/EventDetail.vue'
// import ViewAnalysis from './modules/viewAnalysis/Index.vue'

const route = useRoute()
const id = route.query.id as string
const { data, send } = useRequest(
  alovaInst.Get<Record<string, any> | undefined>(`yq/eventManage/${id}`, {
    transform: (res) => {
      return {
        ...(res as Record<string, any>),
        name: (res as Record<string, any>).eventName,
      }
    },
  }),
  {
    initialData: undefined,
  },
)
const tabs = [
  {
    component: markRaw(EventDetail),
    label: '事件详情列表',
    value: 'taskDetail',
  },
  {
    // component: markRaw(ViewAnalysis),
    label: '事件视图分析',
    value: 'viewAnalysis',
  },
]
const tab = ref(tabs[0]!.value)

provide('id', id)
provide('data', data)
provide('dataType', 3)
provide(
  'limitTimeRange',
  computed(() => data.value?.dataScope?.split(',') ?? []),
)
</script>

<template>
  <div>
    <TCard v-if="data" :title="`事件名称：${data.name}`">
      <template v-if="!isFalsy(data.executionStatus)" #actions>
        <TTag
          :theme="
            data.executionStatus === 1
              ? 'success'
              : data.executionStatus === 2
                ? 'danger'
                : 'default'
          "
        >
          {{ useDicLabel('event_execution_status', data.executionStatus) }}
        </TTag>
      </template>
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
