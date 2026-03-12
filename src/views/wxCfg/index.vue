<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
// return [
//     {
//       model: 'wxUrl',
//       props: {
//         label: '个微地址',
//       },
//     },
//     {
//       model: 'clientId',
//       props: {
//         label: '客户端id',
//       },
//     },
//     {
//       model: 'deviceId',
//       props: {
//         label: '设备id',
//       },
//     },
//     {
//       model: 'wxType',
//       props: {
//         label: '视频媒体类型 1-视频媒体池 2-评论池',
//         options: $dicStore('wx_type').value,
//       },
//       component: 'CSelect',
//     },
//     {
//       model: 'weight',
//       props: {
//         label: '权重',
//       },
//     },
//     {
//       model: 'status',
//       props: {
//         label: '状态 0-启用1-停用',
//         options: $dicStore('status').value,
//       },
//       component: 'CSelect',
//     },
//     {
//       model: 'runTaskId',
//       props: {
//         label: '运行任务id',
//       },
//     },
//     {
//       model: 'searchType',
//       props: {
//         label: '搜索类型 1-默认 2-评论',
//         options: $dicStore('search_type').value,
//       },
//       component: 'CSelect',
//     },
//     {
//       model: 'errorNum',
//       props: {
//         label: '错误次数',
//       },
//     },
//     {
//       model: 'accList',
//       props: {
//         label: '帐号列表',
//       },
//     },
//     {
//       model: 'nowAcc',
//       props: {
//         label: '当前帐号',
//       },
//     },
//   ]
const formItemMap = {
  accList: {
    _label: '帐号列表',
    model: 'accList',
  },
  clientId: {
    _label: '客户端id',
    model: 'clientId',
  },
  deviceId: {
    _label: '设备id',
    model: 'deviceId',
  },
  errorNum: {
    _label: '错误次数',
    model: 'errorNum',
  },
  nowAcc: {
    _label: '当前帐号',
    model: 'nowAcc',
  },
  runTaskId: {
    _label: '运行任务id',
    model: 'runTaskId',
  },
  searchType: {
    _label: '搜索类型',
    component: 'TSelect',
    dicCode: 'search_type',
    model: 'searchType',
  },
  status: {
    _label: '状态',
    component: 'TSelect',
    dicCode: 'status',
    model: 'status',
  },
  weight: {
    _label: '权重',
    model: 'weight',
  },
  wxType: {
    _label: '视频媒体类型',
    component: 'TSelect',
    dicCode: 'wx_type',
    model: 'wxType',
  },
  wxUrl: {
    _label: '个微地址',
    model: 'wxUrl',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    delete: {
      method: 'yq/wxCfg',
      permission: 'yq:wxCfg:remove',
    },
    export: {
      method: 'yq/wxCfg/export',
      permission: 'yq:wxCfg:export',
    },
    list: {
      method: 'yq/wxCfg/list',
    },
  },
  columns: [
    {
      colKey: 'id',
      title: '主键id',
    },
    {
      colKey: 'wxUrl',
      title: '个微地址',
    },
    {
      colKey: 'clientId',
      title: '客户端id',
    },
    {
      colKey: 'deviceId',
      title: '设备id',
    },
    {
      colKey: 'createTime',
      title: '创建时间',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'wx_type',
      },
      colKey: 'wxType',
      title: '视频媒体类型',
    },
    {
      colKey: 'weight',
      title: '权重',
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
      colKey: 'runTaskId',
      title: '运行任务id',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'search_type',
      },
      colKey: 'searchType',
      title: '搜索类型',
    },
    {
      colKey: 'errorNum',
      title: '错误次数',
    },
    {
      colKey: 'accList',
      title: '帐号列表',
    },
    {
      colKey: 'nowAcc',
      title: '当前帐号',
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
                      formItemMap.wxUrl,
                      formItemMap.clientId,
                      formItemMap.deviceId,
                      formItemMap.wxType,
                      formItemMap.weight,
                      formItemMap.status,
                      formItemMap.runTaskId,
                      formItemMap.searchType,
                      formItemMap.errorNum,
                      formItemMap.accList,
                      formItemMap.nowAcc,
                    ],
                    ref: formRef,
                  }),
                header: '修改视频媒体配置',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/wxCfg', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  $msg.success('视频媒体配置修改成功')
                  pageListRef.value!.query()
                },
                width: 730,
              })
            },
            permission: 'yq:wxCfg:edit',
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [
    formItemMap.wxType,
    formItemMap.searchType,
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
                formItemMap.wxUrl,
                formItemMap.clientId,
                formItemMap.deviceId,
                formItemMap.wxType,
                formItemMap.weight,
                formItemMap.status,
                formItemMap.runTaskId,
                formItemMap.searchType,
                formItemMap.errorNum,
                formItemMap.accList,
                formItemMap.nowAcc,
              ],
              ref: formRef,
            }),
          header: '添加视频媒体配置',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/wxCfg', await formRef.value!.validate())
            $msg.success('视频媒体配置添加成功')
            pageListRef.value!.query()
          },
          width: 730,
        })
      },
      permission: 'yq:wxCfg:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
