<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  contentId: {
    _label: '内容id',
    _required: true,
    model: 'contentId',
  },
  pushCfgId: {
    _label: '推送配置id',
    _required: true,
    model: 'pushCfgId',
  },
  pushContent: {
    _class: 'col-span-full',
    _label: '推送内容',
    _required: true,
    component: 'TTextarea',
    maxlength: '',
    model: 'pushContent',
  },
  pushStatus: {
    _label: '推送状态',
    _required: true,
    component: 'TSelect',
    dicCode: 'push_status',
    model: 'pushStatus',
  },
  pushTime: {
    _label: '推送时间',
    _required: true,
    component: 'TDatePicker',
    model: 'pushTime',
  },
  triggerType: {
    _label: '触发类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'trigger_type',
    model: 'triggerType',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: 'yq/warnPushRecord/list',
    },
  },
  columns: [
    {
      colKey: 'contentId',
      title: '内容id',
    },
    {
      colKey: 'pushCfgId',
      title: '推送配置id',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'trigger_type',
      },
      colKey: 'triggerType',
      title: '触发类型',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'push_status',
      },
      colKey: 'pushStatus',
      title: '推送状态',
    },
    {
      colKey: 'pushTime',
      title: '推送时间',
    },
    {
      colKey: 'pushContent',
      resize: {
        maxWidth: 300,
      },
      title: '推送内容',
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
                  h(TForm, {
                    items: [
                      formItemMap.contentId,
                      formItemMap.pushCfgId,
                      formItemMap.triggerType,
                      formItemMap.pushStatus,
                      formItemMap.pushTime,
                      formItemMap.pushContent,
                    ],
                    ref: formRef,
                  }),
                header: '修改预警推送记录',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/warnPushRecord', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('预警推送记录修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:warnPushRecord:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.contentId,
    formItemMap.pushCfgId,
    formItemMap.triggerType,
    formItemMap.pushStatus,
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
