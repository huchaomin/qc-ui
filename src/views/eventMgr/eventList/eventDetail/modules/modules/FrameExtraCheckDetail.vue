<script setup lang="ts">
withDefaults(
  defineProps<{
    result: Record<string, any>
  }>(),
  {},
)

const columns: TableCol[] = [
  {
    colKey: 'title',
    resize: {
      maxWidth: 400,
    },
    title: '标题',
  },
  {
    colKey: 'totalExtraNum',
    title: '抽帧数',
  },
  {
    colKey: 'needPoints',
    title: '所需积分',
  },
]
</script>

<template>
  <div class="no_dialog_pt">
    <TDescriptions>
      <TDescriptionsItem label="所需总积分">{{ result.needPoints }}</TDescriptionsItem>
      <TDescriptionsItem label="总抽帧数">{{ result.totalExtraNum }}</TDescriptionsItem>
    </TDescriptions>
    <TTable :columns="columns" :data="result.videoExtraDetails" row-key="bciId"></TTable>
  </div>
</template>
