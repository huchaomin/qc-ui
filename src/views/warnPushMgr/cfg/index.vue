<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandId: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.range === '1',
      }
    },
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  name: {
    _label: '预警推送名称',
    _required: true,
    model: 'name',
  },
  push_target: {
    _class: 'col-span-full',
    _label: '推送目标',
    slot: 'push_target',
  },
  pushFrequency: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.pushType === '2',
      }
    },
    _label: '推送频率',
    _required: true,
    component: 'Cron',
    model: 'pushFrequency',
  },
  pushType: {
    _label: '推送类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'push_type',
    model: 'pushType',
  },
  range: {
    _label: '预警范围',
    _required: true,
    component: 'TSelect',
    dicCode: 'warn_range',
    model: 'range',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  taskId: {
    __others: (formData: Record<string, any>) => {
      return {
        show: formData.range === '2',
      }
    },
    _label: '任务',
    _required: true,
    component: 'TSelect',
    model: 'taskId',
    options: 'task',
  },
  warn_rule: {
    _class: 'col-span-full',
    _label: '预警推送规则',
    slot: 'warn_rule',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'system/dict/type',
      permission: 'yq:warnPushCfg:remove',
    },
    list: {
      method: 'yq/warnPushCfg/list',
    },
  },
  columns: [
    {
      colKey: 'name',
      title: '预警推送名称',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'warn_range',
      },
      colKey: 'range',
      title: '预警范围',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'push_type',
      },
      colKey: 'pushType',
      title: '推送类型',
    },
    {
      colKey: 'pushFrequency',
      title: '推送频率',
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
              $confirm({
                body: () =>
                  h(resolveComponent('TForm') as Component<FormProps>, {
                    items: [
                      formItemMap.dictName,
                      formItemMap.dictType,
                      {
                        ...formItemMap.status,
                        component: 'TRadioGroup',
                      },
                      formItemMap.remark,
                    ],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改字典类型',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/dict/type', {
                    ...(await formRef.value!.validate()),
                    dictId: row.dictId,
                  })
                  $msg.success('字典类型修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
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
    formItemMap.name,
    formItemMap.range,
    formItemMap.pushType,
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
            h(resolveComponent('TForm') as Component<FormProps>, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.name,
                formItemMap.range,
                formItemMap.brandId,
                formItemMap.taskId,
                formItemMap.pushType,
                formItemMap.pushFrequency,
                formItemMap.status,
                formItemMap.warn_rule,
                formItemMap.push_target,
              ],
              ref: formRef,
            }),
          header: '添加字典类型',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/type', await formRef.value!.validate())
            $msg.success('字典添加成功')
            pageListRef.value!.query()
          },
          width: 1030,
        })
      },
      permission: 'yq:warnPushCfg:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
