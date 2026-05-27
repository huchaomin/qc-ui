<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    data: Record<string, any>
    isInnerTable?: boolean
  }>(),
  {
    isInnerTable: true,
  },
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
      maxWidth: 400,
    },
    title: 'OCR内容',
  },
]
</script>

<template>
  <TTable
    :show-serial-number="!isInnerTable"
    :show-header="!isInnerTable"
    :bordered="!isInnerTable"
    :max-height="Infinity"
    :columns="columns"
    :data="tableData"
    :class="{ table_border_none: isInnerTable }"
  ></TTable>
</template>

<style>
.table_border_none {
  .t-table__content {
    border: none;
  }
}
</style>
