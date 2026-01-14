<script setup lang="ts">
import type { Method } from 'alova'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import { propsInit } from '@/components/tDesignReset/TTable.vue'

export type PageTableProps = Omit<TableProps, 'data' | 'loading'> & {
  method: ((params: Record<string, any>) => Method) | string
}

const props = withDefaults(defineProps<PageTableProps>(), propsInit)
const otherProps = computed(() => {
  const obj: Partial<PageTableProps> = {
    ...props,
  }

  delete obj.method
  return obj as Omit<PageTableProps, 'method'>
})
const listMethod = computed(() => {
  if (typeof props.method === 'string') {
    return (params: Record<string, any>) =>
      alovaInst.Get(props.method as string, {
        params,
      })
  }

  return props.method
})
const {
  data: listData,
  loading: listLoading,
  send: listSend,
} = useRequest(listMethod.value, {
  immediate: false,
  initialData: {
    rows: [],
    total: 0,
  },
})
const pageSize = ref(10)
const pageNum = ref(1)
const total = ref(0)

function query(params?: Record<string, any>) {
  listSend({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    ...(params ?? {}),
  })
}

function reset(params?: Record<string, any>) {
  pageNum.value = 1
  pageSize.value = 10
  listSend({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    ...(params ?? {}),
  })
}

defineExpose({
  query,
  reset,
})
</script>

<template>
  <TTable :data="listData.rows" :loading="listLoading" v-bind="otherProps"></TTable>
</template>
