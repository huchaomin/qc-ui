<script setup lang="ts">
import { columns as _columns } from '@/views/taskMgr/monitorPhrase/index.vue'

const props = withDefaults(
  defineProps<{
    data: any[]
  }>(),
  {},
)
const columns = computed(() => {
  return _columns.filter(
    (item) =>
      !['createBy', 'createTime', 'updateBy', 'updateTime', 'usedStatus'].includes(item.colKey),
  )
})
const usedData = computed(() => {
  return props.data.filter((item) => item.usedStatus === 1)
})
const notUsedData = computed(() => {
  return props.data.filter((item) => item.usedStatus === 0)
})
const source = computed(() => {
  return props.data.map((item) => `(${item.monitorWord})`).join('|')
})
const { copy } = useClipboard({
  legacy: true,
})

async function handleSubmit(): Promise<void> {
  await copy(source.value)
  $msg('复制成功')
  await updateMonitorPhraseUsedStatus({
    idList: props.data.map((item) => item.id),
    usedStatus: 1,
  })
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <div v-if="usedData.length > 0">
    <TTypographyTitle level="h5">已使用</TTypographyTitle>
    <TTable :columns="columns" :data="usedData"></TTable>
  </div>
  <div v-if="notUsedData.length > 0" :class="{ 'mt-4': usedData.length > 0 }">
    <TTypographyTitle level="h5">未使用</TTypographyTitle>
    <TTable :columns="columns" :data="notUsedData"></TTable>
  </div>
  <TTypographyTitle level="h5" class="mt-4"
    >词组汇总结果(一共{{ source.length }}个字)</TTypographyTitle
  >
  <TTextarea :model-value="source" disabled :maxlength="0"></TTextarea>
</template>
