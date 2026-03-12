<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    initialData?: Array<Record<string, any>>
    type?: 'update' | 'view'
  }>(),
  {
    type: 'update',
  },
)
const formData = inject<Record<string, any>>('formData')!
const tableData = ref<Array<Record<string, any>>>(
  props.initialData ?? [
    {
      filed: [],
      filterType: '1',
      keyWord: '',
      logicSymbol: '+',
    },
  ],
)

watch(
  tableData,
  () => {
    if (tableData.value.some((item) => item.filed.length === 0 || isFalsy(item.keyWord.trim()))) {
      if (formData.fieldConfig.length > 0) {
        formData.fieldConfig = []
      }

      return
    }

    formData.fieldConfig = tableData.value.map((item) => ({
      filed: item.filed.join(','),
      filterType: item.filterType,
      keyWord: item.keyWord,
      logicSymbol: item.logicSymbol,
    }))
  },
  {
    deep: true,
  },
)

const hasOneFilterType2 = computed(() => {
  return tableData.value.some((item) => item.filterType === '2')
})
const columns: TableCol[] = [
  {
    cell: (_, { row }) => {
      return {
        _component: 'Select',
        dicCode: 'condition_fields',
        multiple: true,
        status: row.filed.length > 0 ? 'default' : 'error',
      }
    },
    colKey: 'filed',
    title: '条件字段',
    width: 280,
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'Select',
        clearable: false,
        dicCode: 'filter_type',
        disabled: hasOneFilterType2.value && row.filterType === '1',
      }
    },
    colKey: 'filterType',
    title: '条件类型',
    width: 150,
  },
  {
    cell: (_, { row }) => {
      return {
        _component: 'Input',
        onBlur: () => {
          row.keyWord = row.keyWord
            .trim()
            .replace(/\s+/g, '')
            .replace(/（/g, '(')
            .replace(/）/g, ')')
        },
        placeholder: "'()'表示分组，'|'表示或，'+'表示且",
        status: isFalsy(row.keyWord.trim()) ? 'error' : 'default',
      }
    },
    colKey: 'keyWord',
    title: '关键词',
    width: 300,
  },
  {
    cell: (_, { rowIndex }) => {
      if (rowIndex < tableData.value.length - 1) {
        return {
          _component: 'Select',
          clearable: false,
          filterable: false,
          options: [
            {
              label: '+',
              value: '+',
            },
            {
              label: '|',
              value: '|',
            },
          ],
        }
      }
    },
    colKey: 'logicSymbol',
    title: '和下一条的且或关系',
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
              ...tableData.value[rowIndex],
              filterType: '1',
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
  <TPopup placement="top" width="600">
    <Icon
      icon="line-md:question-circle"
      class="absolute"
      size="20"
      style="top: -20px; left: 78px; color: #999; cursor: pointer"
    ></Icon>
    <template #content>
      <ol class="max-w-[600px] pl-3" style="list-style: decimal">
        <li>
          什么情况下用“|”：如想关注问界M5或问界M7或问界M9的新闻，表达式为“问界M5|问界M7|问界M9”，表示文章中出现
          “问界M5”、“问界M7”、“问界M9”任意一个就能监测到
        </li>
        <li class="mt-2">
          什么情况下用“+”：如想关注赛力斯港股上市的新闻，表达式为“赛力斯+港股上市”，表示文章中同时出现
          “赛力斯”和“港股上市”两个关键词才能监测到
        </li>
        <li class="mt-2">
          什么情况下同时用到“+”、“|”：如想关注问界撞人的新闻，由于“问界”又可能被写作“AITO”，表达式为
          “(问界|AITO)+撞人”，表示文章中出现“问界撞人”或“AITO撞人”的内容都会被监测到
        </li>
      </ol>
    </template>
  </TPopup>
  <TTable :columns="columns" :data="tableData"></TTable>
</template>
