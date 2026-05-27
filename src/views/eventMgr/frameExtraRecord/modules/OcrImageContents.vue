<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: Record<string, any>
  }>(),
  {},
)
const tableData = computed(() => {
  const arr: Array<Record<string, any>> = []

  props.data.videoExtraDetails?.forEach((item1: Record<string, any>) => {
    item1.ocrImageContents?.forEach((item2: Record<string, any>) => {
      arr.push(item2)
    })
  })
  return arr
})
const columns: TableCol[] = [
  {
    colKey: 'imageTime',
    title: '图片时间',
  },
  {
    cell: {
      _component: 'ImageViewer',
    },
    colKey: 'fileUrl',
    title: '图片',
  },
  {
    cell: {
      _component: 'TypographyText',
    },
    colKey: 'ocrContent',
    resize: {
      maxWidth: 720,
    },
    title: 'OCR内容',
  },
]
</script>

<template>
  <TTable
    :show-serial-number="false"
    :show-header="false"
    :bordered="false"
    :max-height="Infinity"
    :columns="columns"
    :data="tableData"
    class="table_border_none"
  ></TTable>
</template>

<style>
.table_border_none {
  .t-table__content {
    border: none;
  }
}
</style>
