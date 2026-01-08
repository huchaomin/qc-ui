<script setup lang="ts">
import type { Method } from 'alova'
import type { FormPropsType } from '@/components/tDesignReset/TForm.vue'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import PageQuery from './PageQuery.vue'

export interface PageListConfigType {
  apis: {
    list: {
      method: ((params: Record<string, any>) => Method) | string
    }
  }
  columns: TableProps['columns']

  /**
   * @description: 查询表单配置
   */
  formProps: FormPropsType
  /**
   * @description: 第一次查询是否要父组件来发起, 默认 false
   */
  isFirstQueryByParent?: boolean
  tableOtherProps?: Omit<TableProps, 'columns' | 'data'>
}

const props = withDefaults(defineProps<PageListConfigType>(), {
  isFirstQueryByParent: false,
})
const listMethod = computed(() => {
  if (typeof props.apis.list.method === 'string') {
    return (params: Record<string, any>) =>
      alovaInst.Get(props.apis.list.method as string, {
        params,
      })
  }

  return props.apis.list.method
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

function doQuery(FormData: Record<string, any>) {
  listSend(FormData)
}

const pageQueryRef = useTemplateRef('pageQueryRef')

if (!props.isFirstQueryByParent) {
  void nextTick(() => {
    pageQueryRef.value!.query()
  })
}
</script>

<template>
  <TCard>
    <PageQuery ref="pageQueryRef" v-bind="props.formProps" @query="doQuery"></PageQuery>
    <TTable
      :data="listData.rows"
      :columns="props.columns"
      :loading="listLoading"
      v-bind="props.tableOtherProps"
    ></TTable>
  </TCard>
</template>
