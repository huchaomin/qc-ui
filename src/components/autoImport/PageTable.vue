<script setup lang="ts">
import type { Method } from 'alova'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import { tablePropsInit } from '@/components/tDesignReset/utils'
import { getParamsString } from '@/plugins/alova/index'

export type PageTableProps = {
  /**
   * @description: 是否立即查询, 默认 true
   */
  initialQuery?: boolean
  method: ((params: Record<string, any>) => Method) | string
  /**
   * @description: 传给分页接口的参数, 默认 {}
   */
  queryParams?: Record<string, any>
  /**
   * @description: 与method的meta.useEmptyParams 一致, 默认 true, 用于对比get查询参数是否变化
   */
  useEmptyParams?: boolean
  /**
   * @description: 是否监听传给分页接口的参数, 默认 true
   */
  watchQueryParams?: boolean
} & Omit<TableProps, 'data' | 'loading'>

const props = withDefaults(defineProps<PageTableProps>(), {
  ...tablePropsInit,
  initialQuery: true,
  queryParams: () => ({}),
  useEmptyParams: true,
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
  delete obj.useEmptyParams
  return obj as Omit<
    PageTableProps,
    'initialQuery' | 'method' | 'queryParams' | 'useEmptyParams' | 'watchQueryParams'
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
const queryParamsChangeTimer = ref(0)
const { data, loading } = useWatcher(
  // immediate 为true 初始化时这个函数会执行两遍
  () =>
    listMethod.value({
      pageNum: pageNum.value,
      pageSize: pageSize.value,
      ...props.queryParams,
    }),
  [pageNum, pageSize, queryParamsChangeTimer],
  {
    debounce: 100,
    initialData: {
      rows: [],
      total: 0,
    },
  },
)

if (props.initialQuery) {
  queryParamsChangeTimer.value++
}

watch(
  () => props.queryParams,
  (newVal, oldVal) => {
    if (props.watchQueryParams) {
      if (
        getParamsString(newVal, props.useEmptyParams) !==
        getParamsString(oldVal, props.useEmptyParams)
      ) {
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

const tableRef = useTemplateRef('tableRef')

defineExpose({
  query,
  reset,
  selectedRows: computed(() => tableRef.value?.selectedRows ?? []),
})
</script>

<template>
  <TTable ref="tableRef" :data="data.rows" :loading="loading" v-bind="otherProps">
    <template
      v-for="k in Object.keys($slots).filter((k) => k !== 'table-bottom')"
      :key="k"
      #[k]="slotScope"
    >
      <slot
        :name="k"
        v-bind="{
          ...slotScope,
          res: data,
        }"
      ></slot>
    </template>
    <template #table-bottom="slotScope">
      <TPagination
        v-if="data.total > 0"
        v-model="pageNum"
        v-model:page-size="pageSize"
        :total="Number(data.total)"
      ></TPagination>
      <slot
        name="table-bottom"
        v-bind="{
          ...slotScope,
          res: data,
        }"
      ></slot>
    </template>
  </TTable>
</template>
