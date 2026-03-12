<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initData?: Array<Record<string, any>>
  }>(),
  {},
)
const formData = inject<Record<string, any>>('formData')!
const tableData = ref<Array<Record<string, any>>>(
  props.initData
    ? props.initData.map((item) => {
        return {
          pushPlatform: String(item.pushPlatform),
          targetAddress: item.targetAddress,
        }
      })
    : [
        {
          pushPlatform: '1',
          targetAddress: '',
        },
      ],
)
const initPushPlatformOptions = useDicOptions('push_platform')
const pushPlatformOptions = computed(() => {
  return initPushPlatformOptions.value.map((item) => {
    return {
      ...item,
      disabled: tableData.value.some((d) => d.pushPlatform === item.value),
    }
  })
})
const columns: TableCol[] = [
  {
    cell: reactive({
      _component: 'Select' as const,
      clearable: false,
      options: pushPlatformOptions,
    }),
    colKey: 'pushPlatform',
    title: '目标类型',
    width: 160,
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'Input',
        placeholder: '请输入目标地址, 多个时请用英文逗号分隔',
        status: isFalsy(row.targetAddress.trim()) ? 'error' : 'default',
      }
    },
    colKey: 'targetAddress',
    title: '目标地址',
    width: 590,
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
          disabled: tableData.value.length === initPushPlatformOptions.value.length,
          onClick: () => {
            const newRow: Record<string, any> = {
              ...tableData.value[rowIndex],
              pushPlatform: pushPlatformOptions.value.find((item) => !item.disabled)!.value,
              targetAddress: '',
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
    if (tableData.value.some((item) => isFalsy(item.targetAddress.trim()))) {
      if (formData.pushTarget.length > 0) {
        formData.pushTarget = []
      }

      return
    }

    formData.pushTarget = tableData.value.map((item) => ({
      pushPlatform: item.pushPlatform,
      targetAddress: item.targetAddress,
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
