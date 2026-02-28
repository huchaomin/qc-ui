<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    dictType: string
  }>(),
  {},
)
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  dictLabel: {
    _label: '数据名',
    _required: true,
    model: 'dictLabel',
  },
  dictSort: {
    _label: '字典排序',
    _required: true,
    component: 'TInputNumber',
    decimalPlaces: 0,
    model: 'dictSort',
    theme: 'row',
  },
  dictType: {
    _label: '字典类型',
    disabled: true,
    model: 'dictType',
  },
  dictValue: {
    _label: '数据值',
    _required: true,
    model: 'dictValue',
  },
  remark: {
    _label: '备注',
    component: 'TTextarea',
    model: 'remark',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'sys_normal_disable',
    model: 'status',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'system/dict/data',
      permission: 'system:dict:remove',
      showBatch: true,
    },
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/dict/data/list', {
          params: {
            ...o,
            dictType: props.dictType,
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: [
    {
      colKey: 'dictCode',
      title: '字典编码',
    },
    {
      colKey: 'dictLabel',
      title: '字典标签',
    },
    {
      colKey: 'dictValue',
      title: '字典值',
    },
    {
      colKey: 'dictSort',
      title: '字典排序',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'sys_normal_disable',
      },
      colKey: 'status',
      title: '状态',
    },
    {
      colKey: 'remark',
      title: '备注',
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
                      formItemMap.dictType,
                      formItemMap.dictLabel,
                      formItemMap.dictValue,
                      formItemMap.dictSort,
                      formItemMap.status,
                      formItemMap.remark,
                    ],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改字典数据',
                onConfirmCallback: async () => {
                  await alovaInst.Put('system/dict/data', await formRef.value!.validate())
                  $msg.success('字典数据修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
            permission: 'system:dict:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
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
                dictType: props.dictType,
                status: '0',
              }),
              items: [
                formItemMap.dictType,
                formItemMap.dictLabel,
                formItemMap.dictValue,
                formItemMap.dictSort,
                formItemMap.status,
                formItemMap.remark,
              ],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加字典数据',
          onConfirmCallback: async () => {
            await alovaInst.Post('system/dict/data', await formRef.value!.validate())
            $msg.success('字典数据添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'system:dict:add',
    },
  ],
  tableOtherProps: {
    flexHeight: false,
    rowKey: 'dictCode',
    showColumnConfigBtn: false,
    showToggleFullscreenBtn: false,
  },
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
