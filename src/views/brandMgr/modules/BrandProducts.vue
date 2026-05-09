<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initData?: Array<Record<string, any>>
  }>(),
  {},
)
const formData = inject<Record<string, any>>('formData')!
const tableData = ref<Array<Record<string, any>>>(
  props.initData && props.initData.length > 0
    ? props.initData
    : [
        {
          productName: '',
          productRule: '',
        },
      ],
)

watch(
  tableData,
  () => {
    if (
      tableData.value.some(
        (item) => isFalsy(item.productName.trim()) || isFalsy(item.productRule.trim()),
      )
    ) {
      if (formData.brandProducts.length > 0) {
        formData.brandProducts = []
      }

      return
    }

    formData.brandProducts = tableData.value.map((item) => ({
      productName: item.productName,
      productRule: item.productRule,
    }))
  },
  {
    deep: true,
  },
)

const columns: TableCol[] = [
  {
    cell: (_, { row }) => {
      return {
        _component: 'Input',
        status: isFalsy(row.productName.trim()) ? 'error' : 'default',
      }
    },
    colKey: 'productName',
    resize: {
      minWidth: 280,
    },
    title: '产品名称',
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'Input',
        onBlur: () => {
          row.productRule = row.productRule
            .trim()
            .replace(/\s+/g, '')
            .replace(/（/g, '(')
            .replace(/）/g, ')')
        },
        placeholder: "'()'表示分组，'|'表示或，'+'表示且",
        status: isFalsy(row.productRule.trim()) ? 'error' : 'default',
      }
    },
    colKey: 'productRule',
    resize: {
      minWidth: 500,
    },
    title: '产品匹配规则',
  },
  reactive({
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
          onClick: () => {
            tableData.value.splice(rowIndex + 1, 0, {
              productName: '',
              productRule: '',
            })
          },
        }),
      ],
    },
    colKey: '_operation',
    title: '操作',
  }),
]
</script>

<template>
  <TTable :columns="columns" :data="tableData"></TTable>
</template>
