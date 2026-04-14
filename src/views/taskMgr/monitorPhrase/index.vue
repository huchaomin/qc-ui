<script lang="ts">
import type { Ref } from 'vue'
import type { TableCol } from '@/components/tDesignReset/TTable.vue'
import AuthorName from '@/bus/components/AuthorName.vue'
import HoneycombSummaryPhrases from './modules/HoneycombSummaryPhrases.vue'
import MonitorWord from './modules/MonitorWord.vue'

export const columns: TableCol[] = [
  {
    colKey: 'name',
    title: '监控词组名称',
  },
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'words_type',
    },
    colKey: 'wordsType',
    title: '搜索类型',
  },
  {
    colKey: 'monitorWord',
    resize: {
      maxWidth: 300,
    },
    title: '监控词',
  },
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'status',
    },
    colKey: 'status',
    title: '状态',
  },
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'used_status',
    },
    colKey: 'usedStatus',
    title: '蜜度使用状态',
  },
  {
    colKey: 'createBy',
    title: '创建人',
  },
  {
    colKey: 'createTime',
    title: '创建时间',
  },
  {
    colKey: 'updateBy',
    title: '更新人',
  },
  {
    colKey: 'updateTime',
    title: '更新时间',
  },
]
</script>

<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const selectedRows = computed(() => pageListRef.value?.selectedRows ?? [])
const monitorWordReg =
  /^(?:[^+|() ]+|\([^()|+ ]+(?:[|+][^()|+ ]+)*\))(?:[+|](?:[^+|() ]+|\([^()|+ ]+(?:[|+][^()|+ ]+)*\)))*$/
const formItemMap = {
  author_name: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.wordsType === '2',
      }
    },
    _label: '作者名称',
    slot: 'author_name',
  },
  filterWords: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.wordsType === '2',
      }
    },
    _class: 'col-span-full',
    _label: '过滤词',
    component: 'TTextarea',
    model: 'filterWords',
    placeholder: '请输入过滤词,多个以英文逗号分割',
  },
  monitor_word: {
    __others: (formData: Record<string, any>) => {
      return {
        _rules:
          formData.wordsType === '1'
            ? [
                {
                  message: '请输入正确的高级监控词',
                  pattern: monitorWordReg,
                },
              ]
            : [],
      }
    },
    _class: 'col-span-full',
    _label: '监控词',
    _required: true,
    model: 'monitorWord',
    slot: 'monitor_word',
  },
  name: {
    _label: '监控词组名称',
    _required: true,
    model: 'name',
  },
  status: {
    _label: '词组状态',
    _required: true,
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  wordsType: {
    __others: (formData: Record<string, any>, exposed: Ref<FormExposed>) => {
      return {
        onChange: () => {
          formData.monitorWord = ''
          exposed.value!.clearValidate(['monitorWord'])
        },
      }
    },
    _label: '搜索类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'words_type',
    model: 'wordsType',
  },
} satisfies Record<string, FormItem>
const slotMap = {
  author_name: () =>
    h(AuthorName, {
      onChange: async (
        data: null | { id: null | string; label: string; value: string },
        formData: Record<string, any>,
      ) => {
        if (data === null) {
          return
        }

        if (
          !isFalsy(formData.monitorWord) &&
          formData.monitorWord.split(',').includes(data.label)
        ) {
          $msg.error('该作者已添加')
          return
        }

        formData.monitorWord += `${isFalsy(formData.monitorWord) ? '' : ','}${data.label}`

        if (isFalsy(data.id)) {
          await alovaInst.Post(
            'yq/author/saveAuthorInfo',
            {
              authorName: data.label,
            },
            {
              meta: {
                useLoading: false,
              },
            },
          )
        }
      },
    }),
  monitor_word: () => h(MonitorWord),
}
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/monitorPhrase',
      permission: 'yq:monitorPhrase:remove',
      useListRefreshKey: 'monitorPhrase',
    },
    export: {
      method: 'yq/monitorPhrase/export',
      permission: 'yq:monitorPhrase:export',
    },
    list: {
      method: 'yq/monitorPhrase/list',
    },
  },
  columns: [
    ...columns,
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '编辑',
            onClick: () => {
              const formRef = ref<FormInstance | null>(null)

              watch(
                formRef,
                () => {
                  formRef.value!.setFormData(row, {
                    numberToStringKeys: ['wordsType'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(
                    TForm,
                    {
                      items: [
                        formItemMap.name,
                        formItemMap.status,
                        formItemMap.wordsType,
                        formItemMap.author_name,
                        formItemMap.monitor_word,
                        formItemMap.filterWords,
                      ],
                      ref: formRef,
                    },
                    slotMap,
                  ),
                header: '修改搜索词组',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/monitorPhrase', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  useListRefresh('monitorPhrase')
                  $msg.success('搜索词组修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:monitorPhrase:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.name,
    {
      ...formItemMap.wordsType,
      __others: undefined,
    },
    {
      _label: '监控词',
      model: 'monitorWord',
    },
    {
      _label: '蜜度使用状态',
      component: 'TSelect',
      dicCode: 'used_status',
      model: 'usedStatus',
    },
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(
              TForm,
              {
                data: reactive({
                  status: '0',
                }),
                items: [
                  formItemMap.name,
                  formItemMap.status,
                  formItemMap.wordsType,
                  formItemMap.author_name,
                  formItemMap.monitor_word,
                  formItemMap.filterWords,
                ],
                ref: formRef,
              },
              slotMap,
            ),
          header: '添加搜索词组',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/monitorPhrase', await formRef.value!.validate())
            useListRefresh('monitorPhrase')
            $msg.success('搜索词组添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:monitorPhrase:add',
    },
    reactive({
      default: '蜜度汇总词组',
      disabled: computed(() => selectedRows.value.length === 0),
      onClick: async () => {
        const honeycombSummaryPhrasesRef = ref<InstanceType<typeof HoneycombSummaryPhrases> | null>(
          null,
        )

        void $confirm({
          body: () =>
            h(HoneycombSummaryPhrases, {
              data: selectedRows.value,
              ref: honeycombSummaryPhrasesRef,
            }),
          header: '蜜度汇总词组',
          onConfirmCallback: async () => {
            await honeycombSummaryPhrasesRef.value!.handleSubmit()
          },
          width: 980, // 730
        })
      },
      permission: 'yq:monitorPhrase:honeycomb',
    }),
  ],
  tableOtherProps: {
    showRowSelect: 'multiple',
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
