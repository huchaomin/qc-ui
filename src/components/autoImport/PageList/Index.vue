<script setup lang="ts">
import type { Method } from 'alova'
import type { PageTableProps } from '@/components/autoImport/PageTable.vue'
import type { ButtonProps } from '@/components/tDesignReset/TButton.vue'
import type { FormProps } from '@/components/tDesignReset/TForm.vue'
import type { TableProps, TableRowData } from '@/components/tDesignReset/TTable.vue'
import PageQuery from './PageQuery.vue'

export interface PageListProps {
  apis: {
    delete?: {
      method: ((rows: TableRowData[]) => Method) | string
      permission?: string
      showBatch?: boolean
    }
    export?: {
      exportFileName?: string
      method: ((params: Record<string, any>) => Method) | string
      permission?: string
    }
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
  initialFormData?: FormProps['data']
  /**
   * @description: 第一次查询是否要父组件来发起, 默认 false
   */
  isFirstQueryByParent?: boolean
  /**
   * @description: 表格上面的操作按钮
   */
  operations?: ButtonProps[]
  /**
   * @description: 其他表格配置
   */
  tableOtherProps?: Omit<PageTableProps, 'columns' | 'method'>
}

const props = withDefaults(defineProps<PageListProps>(), {
  isFirstQueryByParent: false,
})
const route = useRoute()
const pageQueryRef = useTemplateRef('pageQueryRef')
const pageTableRef = useTemplateRef('pageTableRef')
const queryParams = ref<Record<string, any>>({})

function doQuery() {
  queryParams.value = _cloneDeep(pageQueryRef.value!.formData)
  pageTableRef.value!.query()
}

if (!props.isFirstQueryByParent) {
  nextTick(() => {
    doQuery()
  })
}

function doReset() {
  queryParams.value = _cloneDeep(pageQueryRef.value!.formData)
  pageTableRef.value!.reset()
}

const selectedRows = computed(() => pageTableRef.value?.selectedRows ?? [])
const batchDeleteProps = computed(() => {
  const config = props.apis.delete

  if (!config) {
    return {}
  }

  return {
    default: '批量删除',
    disabled: selectedRows.value.length === 0,
    onClick: async () => {
      await $confirm('确认删除所选项吗?')
      await (typeof config.method === 'string'
        ? alovaInst.Delete(
            `${config.method}/${selectedRows.value.map((item) => item.id).join(',')}`,
          )
        : config.method(selectedRows.value))
      $msg.success('删除成功')
      doQuery()
    },
    permission: config.permission,
  }
})
const exportProps = computed(() => {
  const config = props.apis.export

  if (!config) {
    return {}
  }

  const finallyQueryParams = pageTableRef.value?.finallyQueryParams
  const postConfig = {
    meta: {
      useDownload: `${config.exportFileName ?? route.meta.title}_${dayjs().format('YYYY-MM-DD_HH:mm:ss')}.xlsx`,
      useEmptyData: true,
      useResponseBlob: true,
    },
  }

  return {
    default: '导出',
    disabled: finallyQueryParams === undefined,
    onClick: async () => {
      await $confirm('确定导出吗?')
      await (typeof config.method === 'string'
        ? alovaInst.Post(config.method, finallyQueryParams, postConfig)
        : config.method(finallyQueryParams!))
    },
    permission: config.permission,
  }
})

defineExpose({
  query: doQuery,
  reset: doReset,
  selectedRows,
})
</script>

<template>
  <TCard class="h-full" :body-full-height="true" body-class-name="!flex flex-col overflow-y-auto">
    <PageQuery
      ref="pageQueryRef"
      :data="props.initialFormData"
      :items="props.formItems"
      v-bind="props.formOtherProps"
      @query="doQuery"
      @reset="doReset"
    >
      <template
        v-for="k in Object.keys($slots).filter((key) => !key.startsWith('table-'))"
        :key="k"
        #[k]="slotScope"
      >
        <slot :name="k" v-bind="slotScope"></slot>
      </template>
    </PageQuery>
    <PageTable
      ref="pageTableRef"
      :method="props.apis.list.method"
      :columns="props.columns"
      :watch-query-params="false"
      :query-params="queryParams"
      :initial-query="false"
      :show-toggle-fullscreen-btn="true"
      :show-column-config-btn="true"
      :flex-height="true"
      class="flex-1"
      v-bind="props.tableOtherProps"
    >
      <template #table-operations>
        <TButton v-for="(operation, index) in props.operations" :key="index" v-bind="operation">
        </TButton>
        <TButton v-if="props.apis.delete?.showBatch" v-bind="batchDeleteProps"></TButton>
        <TButton v-if="props.apis.export" v-bind="exportProps"></TButton>
      </template>
      <template
        v-for="k in Object.keys($slots).filter((key) =>
          ['table-operations', 'table-top', 'table-bottom'].includes(key),
        )"
        :key="k"
        #[k]="slotScope"
      >
        <slot :name="k" v-bind="slotScope"></slot>
      </template>

      <template
        v-for="k in Object.keys($slots).filter(
          (key) =>
            key.startsWith('table-') &&
            !['table-operations', 'table-top', 'table-bottom'].includes(key),
        )"
        :key="k"
        #[k.slice(6)]="slotScope"
      >
        <slot :name="k" v-bind="slotScope"></slot>
      </template>
    </PageTable>
  </TCard>
</template>
