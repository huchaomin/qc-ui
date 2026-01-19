<script setup lang="ts">
import type { PageTableProps } from '@/components/autoImport/PageTable.vue'
import type { FormProps } from '@/components/tDesignReset/TForm.vue'
import type { TableProps } from '@/components/tDesignReset/TTable.vue'
import PageQuery from './PageQuery.vue'

export interface PageListProps {
  apis: {
    list: {
      method: PageTableProps['method']
    }
  }
  columns: TableProps['columns']
  /**
   * @description: 查询表单配置项
   */
  formItems: FormProps['items']
  /**
   * @description: 其他查询表单配置
   */
  formOtherProps?: Omit<FormProps, 'data' | 'items'>

  /**
   * @description: 初始化查询表单数据
   */
  initialFormData: FormProps['data']
  /**
   * @description: 第一次查询是否要父组件来发起, 默认 false
   */
  isFirstQueryByParent?: boolean
  /**
   * @description: 其他表格配置
   */
  tableOtherProps?: Omit<PageTableProps, 'columns' | 'method'>
}

const props = withDefaults(defineProps<PageListProps>(), {
  isFirstQueryByParent: false,
})
const pageQueryRef = useTemplateRef('pageQueryRef')
const pageTableRef = useTemplateRef('pageTableRef')
const queryParams = ref({})

function doQuery() {
  queryParams.value = pageQueryRef.value!.formData
  pageTableRef.value!.query()
}

function doReset() {
  queryParams.value = pageQueryRef.value!.formData
  pageTableRef.value!.reset()
}
</script>

<template>
  <TCard>
    <PageQuery
      ref="pageQueryRef"
      :data="props.initialFormData"
      :items="props.formItems"
      v-bind="props.formOtherProps"
      @query="doQuery"
      @reset="doReset"
    ></PageQuery>
    <PageTable
      ref="pageTableRef"
      :method="props.apis.list.method"
      :columns="props.columns"
      v-bind="props.tableOtherProps"
      :watch-query-params="false"
      :query-params="queryParams"
      :initial-query="!props.isFirstQueryByParent"
    ></PageTable>
  </TCard>
</template>
