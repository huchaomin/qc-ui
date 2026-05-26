<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initialData: Array<Record<string, any>>
    type?: 'update' | 'view'
  }>(),
  {
    type: 'update',
  },
)
const formData = inject<Record<string, any>>('formData')
const tableData = ref<Array<Record<string, any>>>([])

watch(
  () => props.initialData,
  (val) => {
    tableData.value = val.map((item: Record<string, any>) => {
      const obj: Record<string, any> = {}

      Object.keys(item).forEach((key) => {
        obj[key] = item[key] === null ? '' : item[key]
      })
      delete obj.timeDesc
      return obj
    })
  },
  {
    immediate: true,
  },
)
watch(
  tableData,
  () => {
    if (formData === undefined) {
      return
    }

    if (tableData.value.some((item) => isFalsy(item.extraNum))) {
      if (formData.extraCfgList.length > 0) {
        formData.extraCfgList = []
      }

      return
    }

    formData.extraCfgList = tableData.value.map((item) => ({
      endMin: item.endMin,
      extraNum: item.extraNum,
      startMin: item.startMin,
    }))
  },
  {
    deep: true,
  },
)

const columns: TableCol[] = [
  {
    cell: {
      _component: 'InputNumber',
      decimalPlaces: 0,
      disabled: true,
    },
    colKey: 'startMin',
    title: '开始时间(分钟)',
  },
  {
    cell: (_, { row, rowIndex }) => {
      return {
        _component: 'InputNumber',
        decimalPlaces: 0,
        disabled: rowIndex === tableData.value.length - 1 || props.type === 'view',
        max: isFalsy(tableData.value[rowIndex + 1]?.endMin)
          ? Infinity
          : tableData.value[rowIndex + 1]!.endMin - 1,
        min: Number(row.startMin) + 1,
        onChange: (value) => {
          tableData.value[rowIndex + 1]!.startMin = value
        },
      }
    },
    colKey: 'endMin',
    title: '结束时间(分钟)',
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'InputNumber',
        decimalPlaces: 0,
        disabled: props.type === 'view',
        status: isFalsy(row.extraNum) ? 'error' : 'default',
      }
    },
    colKey: 'extraNum',
    title: '抽帧数量',
  },
  reactive({
    cell: {
      _component: 'Buttons',
      buttons: [
        ({ rowIndex }) => ({
          default: '删除',
          disabled: tableData.value.length === 1 || rowIndex < tableData.value.length - 1,
          onClick: () => {
            tableData.value.splice(rowIndex, 1)
            tableData.value[tableData.value.length - 1]!.endMin = ''
          },
        }),
        ({ row, rowIndex }) => ({
          default: '添加行',
          disabled: rowIndex < tableData.value.length - 1,
          onClick: () => {
            if (isFalsy(row.endMin)) {
              row.endMin = Number(row.startMin) + 1
            }

            tableData.value.splice(rowIndex + 1, 0, {
              ...tableData.value[rowIndex],
              endMin: '',
              startMin: row.endMin,
            })
          },
        }),
      ],
    },
    colKey: '_operation',
    title: '操作',
    visible: computed(() => props.type === 'update').value,
  }),
]
</script>

<template>
  <TTable :columns="columns" :data="tableData"></TTable>
</template>
