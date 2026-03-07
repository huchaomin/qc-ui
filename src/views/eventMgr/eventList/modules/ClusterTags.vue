<script setup lang="ts">
const formData = inject<Record<string, any>>('formData')!
const { data: parentList } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/type/getList'),
  {
    initialData: [],
  },
)
const { data: subList } = useRequest(
  alovaInst.Get<Array<Record<string, any>>>('yq/category/getList'),
  {
    initialData: [],
  },
)
const clusterTagsOptions = computed(() => {
  return parentList.value.map((item) => ({
    children: subList.value
      .filter((sub) => sub.typeId === item.id)
      .map((sub) => ({
        label: sub.categoryName,
        value: sub.id,
      })),
    label: item.typeName,
    value: `${item.id}_parent`,
  }))
})
</script>

<template>
  <TTreeSelect
    v-model="formData.clusterTags"
    :filterable="false"
    :multiple="true"
    :data="clusterTagsOptions"
    :select-input-props="{
      minCollapsedNum: 0,
    }"
  >
  </TTreeSelect>
</template>
