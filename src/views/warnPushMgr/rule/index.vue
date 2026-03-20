<script setup lang="ts">
import FieldConfig from './modules/FieldConfig.vue'

const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandId: {
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  field_config: {
    _class: 'col-span-full',
    _label: '预警条件',
    _required: true,
    model: 'fieldConfig',
    slot: 'field_config',
  },
  ruleDesc: {
    _class: 'col-span-full',
    _label: '描述',
    model: 'ruleDesc',
  },
  ruleName: {
    _label: '规则名称',
    _required: true,
    model: 'ruleName',
  },
  ruleType: {
    _label: '规则类型',
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

function getSlotMap({ fieldConfig }: { fieldConfig?: Array<Record<string, any>> } = {}) {
  return {
    field_config: () => h(FieldConfig, { initData: fieldConfig }),
  }
}

const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/warnPushRule',
      permission: 'yq:warnPushRule:remove',
    },
    list: {
      method: 'yq/warnPushRule/list',
    },
  },
  columns: [
    {
      colKey: 'ruleName',
      title: '规则名称',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'event_strategy_type',
      },
      colKey: 'ruleType',
      title: '规则类型',
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
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌id',
    },
    {
      colKey: 'ruleDesc',
      resize: {
        maxWidth: 300,
      },
      title: '描述',
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
                  formRef.value!.setFormData(row, {
                    numberToStringKeys: ['status', 'ruleType'],
                  })
                },
                {
                  once: true,
                },
              )
              $confirm({
                body: () =>
                  h(
                    resolveComponent('TForm') as Component<FormProps>,
                    {
                      items: [
                        formItemMap.ruleName,
                        formItemMap.ruleType,
                        formItemMap.brandId,
                        formItemMap.status,
                        formItemMap.ruleDesc,
                        formItemMap.field_config,
                      ],
                      ref: formRef,
                    },
                    getSlotMap({ fieldConfig: row.fieldConfig }),
                  ),
                header: '修改预警推送规则',
                onConfirmCallback: async () => {
                  const obj = await formRef.value!.validate()

                  await alovaInst.Put('yq/warnPushRule', {
                    ...obj,
                    id: row.id,
                  })
                  $msg.success('预警推送规则修改成功')
                  pageListRef.value!.query()
                },
                width: 1180,
              })
            },
            permission: 'yq:warnPushRule:edit',
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
    formItemMap.brandId,
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
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
                  formItemMap.brandId,
                  formItemMap.status,
                  formItemMap.ruleDesc,
                  formItemMap.field_config,
                ],
                ref: formRef,
              },
              getSlotMap(),
            ),
          header: '新增预警推送规则',
          onConfirmCallback: async () => {
            const obj = await formRef.value!.validate()

            await alovaInst.Post('yq/warnPushRule', obj)
            $msg.success('预警推送规则新增成功')
            pageListRef.value!.query()
          },
          width: 1180,
        })
      },
      permission: 'yq:warnPushRule:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
