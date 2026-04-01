<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initData?: Array<Record<string, any>>
  }>(),
  {},
)
const formData = inject<Record<string, any>>('formData')!
const formExposed = inject<ComputedRef<FormExposed | null>>('formExposed')!
const tableData = ref<Array<Record<string, any>>>(
  props.initData
    ? props.initData.map((item) => {
        return {
          columnName: String(item.columnName),
          showName: item.showName,
        }
      })
    : [
        {
          columnName: '',
          showName: '',
        },
      ],
)
const initWarnFieldOptions = computed(() => {
  return formData.range === '3'
    ? useDicOptions('live_warn_field').value
    : useDicOptions('warn_field').value
})

watch(
  () => formData.range,
  () => {
    tableData.value = [
      {
        columnName: '',
        showName: '',
      },
    ]
    formExposed.value?.clearValidate(['warnTemplate'])
  },
)

const warnFieldOptions = computed(() => {
  return initWarnFieldOptions.value.map((item) => {
    return {
      ...item,
      disabled: tableData.value.some((d) => d.columnName === item.value),
    }
  })
})
const columns: TableCol[] = [
  {
    cell: (_, { row }) => {
      return {
        _component: 'Select' as const,
        clearable: false,
        options: warnFieldOptions.value,
        status: isFalsy(row.columnName) ? 'error' : 'default',
      }
    },
    colKey: 'columnName',
    resize: {
      minWidth: 150,
    },
    title: '推送字段名称',
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'Input',
        status: isFalsy(row.showName.trim()) ? 'error' : 'default',
      }
    },
    colKey: 'showName',
    resize: {
      minWidth: 590,
    },
    title: '推送描述',
  },
  {
    cell: {
      _component: 'Buttons',
      buttons: [
        ({ rowIndex }) => ({
          default: '删除',
          disabled: tableData.value.length === 1,
          onClick: () => {
            tableData.value.splice(rowIndex, 1)
          },
        }),
        ({ rowIndex }) => ({
          default: '添加行',
          disabled: tableData.value.length === initWarnFieldOptions.value.length,
          onClick: () => {
            const newRow: Record<string, any> = {
              ...tableData.value[rowIndex],
              columnName: warnFieldOptions.value.find((item) => !item.disabled)!.value,
              showName: '',
            }

            tableData.value.splice(rowIndex + 1, 0, newRow)
          },
        }),
      ],
    },
    colKey: '_operation',
    title: '操作',
  },
]

watch(
  tableData,
  () => {
    if (tableData.value.some((item) => isFalsy(item.showName.trim()) || isFalsy(item.columnName))) {
      if (formData.warnTemplate.length > 0) {
        formData.warnTemplate = []
      }

      return
    }

    formData.warnTemplate = tableData.value.map((item) => ({
      columnName: item.columnName,
      showName: item.showName,
    }))
  },
  {
    deep: true,
  },
)
</script>

<template>
  <TTable :columns="columns" :data="tableData"></TTable>
</template>
