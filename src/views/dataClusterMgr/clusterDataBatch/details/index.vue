<script setup lang="ts">
import DetailList from './modules/DetailList.vue'

const route = useRoute()
const id = route.query.id as string
const { data } = useRequest(alovaInst.Get<Record<string, any> | undefined>(`yq/labelBatch/${id}`), {
  initialData: undefined,
})
const title = computed(() => {
  if (data.value === undefined) {
    return ''
  }

  return `品牌：${useListLabel('brand', data.value.brandId).value}`
})
const tabs = [
  {
    component: markRaw(DetailList),
    label: '事件详情列表',
    value: 'detailList',
  },
  // {
  //   component: markRaw(ViewAnalysis),
  //   label: '事件视图分析',
  //   value: 'viewAnalysis',
  // },
]
const tab = ref(tabs[0]!.value)

provide('id', id)
</script>

<template>
  <div>
    <TCard v-if="data" :title="title">
      <template #actions>
        <span>
          {{ `发布时间：${data.publishTimeStart} - ${data.publishTimeEnd}` }}
        </span>
      </template>
      <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-4">
        <TCard title="总数据量" :header-bordered="false" body-class-name="pt-0!">
          <TStatistic :value="Number(data.totalCount ?? 0)"></TStatistic>
        </TCard>
        <TCard title="已聚类" :header-bordered="false" body-class-name="pt-0!">
          <TStatistic :value="Number(data.dictLabeledCount ?? 0)"></TStatistic>
        </TCard>
        <TCard title="未聚类" :header-bordered="false" body-class-name="pt-0!">
          <TStatistic :value="Number(data.unlabeledCount ?? 0)"></TStatistic>
        </TCard>
        <TCard title="类别数量" :header-bordered="false" body-class-name="pt-0!">
          <TStatistic :value="Number(data.distinctCategoryCount ?? 0)"></TStatistic>
        </TCard>
      </div>
    </TCard>
    <TCard class="mt-4!">
      <TTabs v-model="tab" size="large" class="-mt-4!">
        <TTabPanel v-for="item in tabs" :key="item.value" :value="item.value" :label="item.label">
          <Component :is="item.component" class="mt-4!"></Component>
        </TTabPanel>
      </TTabs>
    </TCard>
  </div>
</template>
