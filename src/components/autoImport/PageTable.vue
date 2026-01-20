<script setup lang="ts">
import type { Method } from 'alova'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import { propsInit } from '@/components/tDesignReset/TTable.vue'
import { getParamsString } from '@/plugins/alova/index'

export type PageTableProps = {
  /**
   * @description: 是否立即查询
   */
  initialQuery?: boolean
  method: ((params: Record<string, any>) => Method) | string
  /**
   * @description: 传给分页接口的参数
   */
  queryParams?: Record<string, any>
  /**
   * @description: 是否监听传给分页接口的参数
   */
  watchQueryParams?: boolean
} & Omit<TableProps, 'data' | 'loading'>

const props = withDefaults(defineProps<PageTableProps>(), {
  ...propsInit,
  initialQuery: true,
  queryParams: () => ({}),
  watchQueryParams: true,
})
const otherProps = computed(() => {
  const obj: Partial<PageTableProps> = {
    ...props,
  }

  delete obj.method
  delete obj.queryParams
  delete obj.watchQueryParams
  delete obj.initialQuery
  return obj as Omit<PageTableProps, 'initialQuery' | 'method' | 'queryParams' | 'watchQueryParams'>
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
const pageNum = ref(1)
const pageSize = ref(10)
const queryParamsChangeTimer = ref(0)
const { data, loading } = useWatcher(
  // 初始化时这个函数会执行两遍
  () =>
    listMethod.value({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      ...props.queryParams,
    }),
  [pageNum, pageSize, queryParamsChangeTimer],
  {
    debounce: 100,
    immediate: props.initialQuery,
    initialData: {
      rows: [],
      total: 0,
    },
  },
)

watch(
  () => props.queryParams,
  (newVal, oldVal) => {
    if (props.watchQueryParams) {
      const useEmptyParams = listMethod.value({}).meta?.useEmptyParams ?? true

      if (getParamsString(newVal, useEmptyParams) !== getParamsString(oldVal, useEmptyParams)) {
        queryParamsChangeTimer.value++
      }
    }
  },
  {
    deep: true,
  },
)

function query() {
  queryParamsChangeTimer.value++
}

function reset() {
  pageNum.value = 1
  pageSize.value = 10
  queryParamsChangeTimer.value++
}

defineExpose({
  query,
  reset,
})
</script>

<template>
  <TTable :data="data.rows" :loading="loading" v-bind="otherProps">
    <template v-if="data.total > 0" #table-pagination>
      <TPagination
        v-model="pageNum"
        v-model:page-size="pageSize"
        :total="Number(data.total)"
      ></TPagination>
    </template>
  </TTable>
</template>
