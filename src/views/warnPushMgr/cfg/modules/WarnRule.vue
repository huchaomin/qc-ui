<script setup lang="ts">
import TRangeInput from '@/components/tDesignReset/TRangeInput.vue'
import TSelect from '@/components/tDesignReset/TSelect.vue'

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
          ruleContent: ['2', '3'].includes(String(item.ruleType))
            ? item.ruleContent.split(',')
            : item.ruleContent,
          ruleType: String(item.ruleType),
        }
      })
    : [
        {
          ruleContent: '',
          ruleType: '1',
        },
      ],
)
const initWarnRuleTypeOptions = useDicOptions('warn_rule_type')
const warnRuleTypeOptions = computed(() => {
  return initWarnRuleTypeOptions.value.map((item) => {
    return {
      ...item,
      disabled: tableData.value.some((d) => d.ruleType === item.value),
    }
  })
})
const columns: TableCol[] = [
  {
    cell: (_, { row }) => {
      return {
        _component: 'Select',
        clearable: false,
        onChange: () => {
          row.ruleContent = ['3'].includes(row.ruleType)
            ? []
            : ['2'].includes(row.ruleType)
              ? ['', '', '', '']
              : ''
        },
        options: warnRuleTypeOptions.value,
      }
    },
    colKey: 'ruleType',
    title: '规则类型',
    width: 160,
  },
  {
    cell: (_, { row }) => {
      if (row.ruleType === '1') {
        return {
          _component: 'Select',
          options: 'warnPushRule',
          status: isFalsy(row.ruleContent) ? 'error' : 'default',
        }
      }

      if (row.ruleType === '2') {
        return h(
          'div',
          {
            class: 'static_form_item grid grid-cols-3 gap-2',
          },
          [
            h(TSelect, {
              clearable: false,
              filterable: false,
              modelValue: row.ruleContent[0],
              onChange: (value) => {
                row.ruleContent[0] = value
              },
              options: [
                {
                  label: '[',
                  value: '[',
                },
                {
                  label: '(',
                  value: '(',
                },
              ],
              status: isFalsy(row.ruleContent[0]) ? 'error' : 'default',
            }),
            h(TRangeInput, {
              max: 10,
              modelValue: [row.ruleContent[1], row.ruleContent[2]],
              'onUpdate:modelValue': (value) => {
                row.ruleContent[1] = value[0]
                row.ruleContent[2] = value[1]
              },
              status:
                isFalsy(row.ruleContent[1]) || isFalsy(row.ruleContent[2]) ? 'error' : 'default',
            }),
            h(TSelect, {
              clearable: false,
              filterable: false,
              modelValue: row.ruleContent[3],
              onChange: (value) => {
                row.ruleContent[3] = value
              },
              options: [
                {
                  label: ']',
                  value: ']',
                },
                {
                  label: ')',
                  value: ')',
                },
              ],
              status: isFalsy(row.ruleContent[3]) ? 'error' : 'default',
            }),
          ],
        )
      }

      if (row.ruleType === '3') {
        return {
          _component: 'Select',
          dicCode: 'product_relate_type',
          minCollapsedNum: 0,
          multiple: true,
          status: row.ruleContent.length === 0 ? 'error' : 'default',
        }
      }

      if (row.ruleType === '4') {
        return {
          _component: 'InputNumber',
          autoWidth: false,
          decimalPlaces: 0,
          max: 24,
          placeholder: '请输入小时数(0-24小时)',
          status: isFalsy(row.ruleContent) ? 'error' : 'default',
          theme: 'row',
        }
      }
    },
    colKey: 'ruleContent',
    title: '规则内容',
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
          disabled: tableData.value.length === initWarnRuleTypeOptions.value.length,
          onClick: () => {
            const newRow: Record<string, any> = {
              ...tableData.value[rowIndex],
              ruleContent: '',
              ruleType: warnRuleTypeOptions.value.find((item) => !item.disabled)!.value,
            }

            if (newRow.ruleType === '2') {
              newRow.ruleContent = ['', '', '', '']
            } else if (newRow.ruleType === '3') {
              newRow.ruleContent = ['1']
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
    if (
      tableData.value.some((item) =>
        Array.isArray(item.ruleContent)
          ? item.ruleContent.length === 0 ||
            item.ruleContent.filter((i: any) => isFalsy(i)).length !== 0
          : isFalsy(item.ruleContent),
      )
    ) {
      if (formData.warnRule.length > 0) {
        formData.warnRule = []
      }

      return
    }

    formData.warnRule = tableData.value.map((item) => ({
      ruleContent: ['2', '3'].includes(item.ruleType)
        ? item.ruleContent.join(',')
        : item.ruleContent,
      ruleType: item.ruleType,
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
