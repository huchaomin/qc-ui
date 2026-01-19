<script setup lang="ts">
import type { Method } from 'alova'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import { propsInit } from '@/components/tDesignReset/TTable.vue'
import { getParamsString } from '@/plugins/alova/index'

export type PageTableProps = {
  method: ((params: Record<string, any>) => Method) | string
  /**
   * @description: 传给分页接口的参数
   */
  queryParams?: Record<string, any>
  /**
   * @description: 是否监听传给分页接口的参数
   */
  watchQueryParams?: boolean
  /**
   * @description: 是否立即监听传给分页接口的参数,watchQueryParams为true时有效，仅初始化时的值有效
   */
  watchQueryParamsImmediate?: boolean
} & Omit<TableProps, 'data' | 'loading'>

const props = withDefaults(defineProps<PageTableProps>(), {
  ...propsInit,
  queryParams: () => ({}),
  watchQueryParams: true,
  watchQueryParamsImmediate: true,
})
const otherProps = computed(() => {
  const obj: Partial<PageTableProps> = {
    ...props,
  }

  delete obj.method
  delete obj.queryParams
  delete obj.watchQueryParams
  delete obj.watchQueryParamsImmediate
  return obj as Omit<
    PageTableProps,
    'method' | 'queryParams' | 'watchQueryParams' | 'watchQueryParamsImmediate'
  >
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
const total = ref(0)
const queryParamsChangeTimer = ref(0)
const { data, loading, send } = useWatcher(
  listMethod.value({
    pageNum: pageNum.value,
    pageSize: pageSize.value,
    ...props.queryParams,
  }),
  [pageNum, pageSize, queryParamsChangeTimer],
  {
    debounce: 500,
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

      if (
        getParamsString(newVal, useEmptyParams) !== getParamsString(oldVal ?? {}, useEmptyParams)
      ) {
        queryParamsChangeTimer.value++
      }
    }
  },
  {
    deep: true,
    immediate: props.watchQueryParamsImmediate,
  },
)

function query() {
  send()
}

function reset() {
  pageNum.value = 1
  pageSize.value = 10
}

defineExpose({
  query,
  reset,
})
</script>

<template>
  <TTable :data="data.rows" :loading="loading" v-bind="otherProps"></TTable>
</template>
