<script lang="ts">
import EventCondition from './modules/EventCondition.vue'

const formItemMap = {
  event_condition: {
    _class: 'col-span-full',
    _label: '事件条件',
    _rules: [
      {
        message: '请填写完整的事件条件',
        required: true,
      },
    ],
    model: 'fieldConfig',
    slot: 'event_condition',
  },
  ruleDesc: {
    _class: 'col-span-3',
    _label: '策略说明',
    model: 'ruleDesc',
  },
  ruleName: {
    _label: '策略名称',
    _required: true,
    model: 'ruleName',
  },
  ruleType: {
    _label: '策略类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'event_strategy_type',
    model: 'ruleType',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
} satisfies Record<string, FormItem>

export function addEventStrategy(): Promise<void> {
  return new Promise((resolve) => {
    const formRef = ref<FormInstance | null>(null)

    $confirm({
      body: () =>
        h(
          resolveComponent('TForm') as Component<FormProps>,
          {
            data: reactive({
              status: '0',
            }),
            items: [
              formItemMap.ruleName,
              formItemMap.ruleType,
              formItemMap.status,
              formItemMap.ruleDesc,
              formItemMap.event_condition,
            ],
            ref: formRef,
          },
          {
            event_condition: () => h(EventCondition),
          },
        ),
      header: '添加事件策略',
      onConfirmCallback: async () => {
        await alovaInst.Post('yq/eventRule', await formRef.value!.validate())
        useListRefresh('eventRule')
        $msg.success('事件策略添加成功')
        resolve()
      },
      width: 1200,
    })
  })
}
</script>

<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/eventRule',
      permission: 'yq:eventRule:remove',
    },
    list: {
      method: 'yq/eventRule/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '策略编号',
    },
    {
      colKey: 'ruleName',
      title: '策略名称',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'event_strategy_type',
      },
      colKey: 'ruleType',
      title: '策略类型',
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
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      colKey: 'createBy',
      title: '创建人',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      colKey: 'updateTime',
      title: '更新时间',
    },
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
                  formRef.value!.setFormData(row)
                },
                {
                  once: true,
                },
              )

              // 为什么这个写在下面会导致 循环渲染？
              const initialData = row.fieldConfig.map((item: Record<string, any>) => {
                return {
                  filed: item.filed.split(','),
                  filterType: String(item.filterType),
                  keyWord: item.keyWord,
                  logicSymbol: item.logicSymbol,
                }
              })

              $confirm({
                body: () =>
                  h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      items: [
                        formItemMap.ruleName,
                        formItemMap.ruleType,
                        formItemMap.status,
                        formItemMap.ruleDesc,
                        formItemMap.event_condition,
                      ],
                      ref: formRef,
                    },
                    {
                      event_condition: () => {
                        return h(EventCondition, {
                          initialData,
                        })
                      },
                    },
                  ),
                header: '修改事件策略',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/eventRule', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('事件策略修改成功')
                  pageListRef.value!.query()
                },
                width: 1200,
              })
            },
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.ruleName,
    formItemMap.ruleType,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        addEventStrategy().then(() => {
          pageListRef.value!.query()
        })
      },
      permission: 'yq:eventRule:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
