<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
// return [
//     {
//       model: 'brandId',
//       props: {
//         label: '品牌id',
//       },
//     },
//     {
//       model: 'ticketType',
//       props: {
//         label: 'ticket类型1-数据拉取 2-方案',
//         options: $dicStore('ticket_type').value,
//         rules: [{ required: true, message: '必填' }],
//       },
//       component: 'CSelect',
//     },
//     {
//       model: 'ticket',
//       props: {
//         label: '微博ticket',
//         rules: [{ required: true, message: '必填' }],
//       },
//     },
//     {
//       model: 'authorizeCode',
//       props: {
//         label: '鉴权码',
//       },
//     },
//     {
//       model: 'accessToken',
//       props: {
//         label: '授权token',
//       },
//     },
//     {
//       model: 'remark',
//       props: {
//         label: '备注',
//       },
//     },
//     {
//       model: 'offsetNum',
//       props: {
//         label: '拉取数据位置标记',
//       },
//     },
//     {
//       model: 'status',
//       props: {
//         label: '状态0-有效1-无效',
//         options: $dicStore('status').value,
//       },
//       component: 'CRadio',
//     },
//     {
//       model: 'dataType',
//       props: {
//         label: '数据类型1-视频 2-内容 3-其他',
//         options: $dicStore('data_type').value,
//         rules: [{ required: true, message: '必填' }],
//       },
//       component: 'CSelect',
//     },
//   ]
const formItemMap = {
  accessToken: {
    _label: '授权token',
    model: 'accessToken',
  },
  authorizeCode: {
    _label: '鉴权码',
    model: 'authorizeCode',
  },
  brandId: {
    _label: '品牌id',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  dataType: {
    _label: '数据类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'data_type',
    model: 'dataType',
  },
  offsetNum: {
    _label: '拉取数据位置标记',
    model: 'offsetNum',
  },
  remark: {
    _label: '备注',
    model: 'remark',
  },
  status: {
    _label: '状态',
    component: 'TRadioGroup',
    dicCode: 'status',
    model: 'status',
  },
  ticket: {
    _label: '微博ticket',
    _required: true,
    model: 'ticket',
  },
  ticketType: {
    _label: 'ticket类型',
    _required: true,
    component: 'TSelect',
    dicCode: 'ticket_type',
    model: 'ticketType',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/wbTaskCfg',
      permission: 'yq:wbTaskCfg:remove',
    },
    export: {
      method: 'yq/wbTaskCfg/export',
      permission: 'yq:wbTaskCfg:export',
    },
    list: {
      method: 'yq/wbTaskCfg/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '主键',
    },
    {
      cell: {
        _component: 'OptionLabel',
        multiple: true,
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌id',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'ticket_type',
      },
      colKey: 'ticketType',
      title: 'ticket类型',
    },
    {
      colKey: 'ticket',
      title: '微博ticket',
    },
    {
      colKey: 'authorizeCode',
      title: '鉴权码',
    },
    {
      colKey: 'accessToken',
      title: '授权token',
    },
    {
      colKey: 'remark',
      title: '备注',
    },
    {
      colKey: 'offsetNum',
      title: '拉取数据位置标记',
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
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'data_type',
      },
      colKey: 'dataType',
      title: '数据类型',
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
                      formItemMap.brandId,
                      formItemMap.ticketType,
                      formItemMap.ticket,
                      formItemMap.authorizeCode,
                      formItemMap.accessToken,
                      formItemMap.remark,
                      formItemMap.offsetNum,
                      formItemMap.status,
                      formItemMap.dataType,
                    ],
                    ref: formRef,
                  }),
                header: '修改微博任务配置',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/wbTaskCfg', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('微博任务配置修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:wbTaskCfg:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.brandId,
    formItemMap.ticketType,
    {
      ...formItemMap.status,
      component: 'TSelect',
    },
    formItemMap.dataType,
  ],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(TForm, {
              data: reactive({
                status: '0',
              }),
              items: [
                formItemMap.brandId,
                formItemMap.ticketType,
                formItemMap.ticket,
                formItemMap.authorizeCode,
                formItemMap.accessToken,
                formItemMap.remark,
                formItemMap.offsetNum,
                formItemMap.status,
                formItemMap.dataType,
              ],
              ref: formRef,
            }),
          header: '添加微博任务配置',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/wbTaskCfg', await formRef.value!.validate())
            $msg.success('微博任务配置添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:wbTaskCfg:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
