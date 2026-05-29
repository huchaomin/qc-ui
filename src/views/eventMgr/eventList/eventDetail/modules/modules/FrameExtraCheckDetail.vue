<script setup lang="ts">
import type { TableCol } from '@/components/tDesignReset/TTable.d.ts'

const props = withDefaults(
  defineProps<{
    columns: TableCol[]
    result: Record<string, any>
    rows: Array<Record<string, any>>
  }>(),
  {},
)
const successColumns = computed(() => {
  return [
    ...props.columns,
    {
      colKey: 'totalExtraNum',
      title: '抽帧数',
    },
    {
      colKey: 'needPoints',
      title: '所需积分',
    },
  ]
})
const failedRows = computed(() => {
  return props.rows.filter((item) => props.result.extraFailBciIds?.includes(item.bciId) ?? false)
})
const successRows = computed(() => {
  const arr: Array<Record<string, any>> = []

  props.rows.forEach((item) => {
    const find = props.result.videoExtraDetails?.find(
      (item1: Record<string, any>) => item1.bciId === item.bciId,
    )

    if (find !== undefined) {
      arr.push({
        ...item,
        ...find,
      })
    }
  })
  return arr
})
</script>

<template>
  <div class="no_dialog_pt">
    <TDescriptions :column="3" :colon="true">
      <TDescriptionsItem label="所需总积分">{{ result.needPoints }}</TDescriptionsItem>
      <TDescriptionsItem label="用户当前积分">{{ result.userPoints }}</TDescriptionsItem>
      <TDescriptionsItem label="总抽帧数">{{ result.totalExtraNum }}</TDescriptionsItem>
    </TDescriptions>
    <TTable :columns="successColumns" :data="successRows" row-key="bciId"></TTable>
    <template v-if="failedRows.length > 0">
      <div class="mt-4">以下选项不符合抽帧策略：</div>
      <TTable
        v-if="failedRows.length > 0"
        :columns="columns"
        :data="failedRows"
        row-key="bciId"
      ></TTable>
    </template>
  </div>
</template>
