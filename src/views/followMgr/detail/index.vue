<script setup lang="ts">
import FollowDetail from './modules/FollowDetail.vue'

const route = useRoute()
const id = route.query.id as string
const { data } = useRequest(
  () => alovaInst.Get<Record<string, any> | undefined>(`yq/followManage/${id}`),
  {
    initialData: undefined,
  },
)
const tabs = [
  {
    component: markRaw(FollowDetail),
    label: '关注详情列表',
    value: 'followDetail',
  },
  // {
  //   component: markRaw(FollowTrends),
  //   label: '关注视图分析',
  //   value: 'followTrends',
  // },
]
const tab = ref(tabs[0]!.value)

provide('id', id)
provide('data', data)
provide('dataType', 2)
</script>

<template>
  <div>
    <TCard v-if="data" :title="`关注组名称：${data.name}`">
      <div class="grid grid-cols-[repeat(auto-fill,minmax(250px,1fr))] gap-3">
        <div>
          <span class="text-(--td-text-color-placeholder)">品牌：</span>
          <span>{{ useListLabel('brand', data.brandId) }}</span>
        </div>
        <div v-if="!isFalsy(data.platforms)">
          <span class="text-(--td-text-color-placeholder)">涉及平台：</span>
          <span>{{ data.platforms }}</span>
        </div>
        <div v-if="!isFalsy(data.followTotal)">
          <span class="text-(--td-text-color-placeholder)">关注项：</span>
          <span>{{ data.followTotal }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">创建人：</span>
          <span>{{ data.createBy }}</span>
        </div>
        <div>
          <span class="text-(--td-text-color-placeholder)">创建时间：</span>
          <span>{{ data.createTime }}</span>
        </div>
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
