<script setup lang="ts">
const router = useRouter()
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandId: {
    _label: '品牌',
    _required: true,
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  listName: {
    _label: '名单名称',
    _required: true,
    model: 'listName',
  },
  platform: {
    _label: '平台',
    model: 'platform',
  },
  type: {
    _label: '名单分类',
    _required: true,
    component: 'TSelect',
    dicCode: 'name_type',
    model: 'type',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    export: {
      method: 'yq/nameList/export',
      permission: 'yq:nameList:export',
    },
    list: {
      method: 'yq/nameList/list',
    },
  },
  columns: [
    {
      cell: {
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌',
    },
    {
      colKey: 'platform',
      title: '平台',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'name_type',
      },
      colKey: 'type',
      title: '名单分类',
    },
    {
      cell: (_, { row }) => {
        return {
          _component: 'Link',
          onClick: () => {
            router.push({
              name: 'BrandAuthorDetail',
              query: {
                id: row.id,
              },
            })
          },
        }
      },
      colKey: 'listName',
      title: '名单名称',
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
                    items: [formItemMap.brandId, formItemMap.type, formItemMap.listName],
                    labelAlign: 'right',
                    layout: 'vertical',
                    ref: formRef,
                  }),
                header: '修改名单',
                onConfirmCallback: async () => {
                  await alovaInst.Put('yq/nameList', {
                    ...(await formRef.value!.validate()),
                    id: row.id,
                  })
                  useListRefresh('name')
                  $msg.success('名单修改成功')
                  pageListRef.value!.query()
                },
                width: 430,
              })
            },
            permission: 'yq:nameList:edit',
          }),
          ({ row }) => ({
            default: '删除',
            permission: 'yq:nameList:remove',
            popconfirm: {
              content: '确认删除吗',
              onConfirm: async () => {
                await alovaInst.Delete(`yq/nameList/${row.id}`)
                useListRefresh('name')
                $msg('删除成功')
                pageListRef.value!.query()
              },
            },
            show: row.type !== 3,
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [formItemMap.brandId, formItemMap.platform, formItemMap.type, formItemMap.listName],
  operations: [
    {
      default: '新增',
      onClick: () => {
        const formRef = ref<FormInstance | null>(null)

        $confirm({
          body: () =>
            h(resolveComponent('TForm') as Component<FormProps>, {
              items: [formItemMap.brandId, formItemMap.type, formItemMap.listName],
              labelAlign: 'right',
              layout: 'vertical',
              ref: formRef,
            }),
          header: '添加名单',
          onConfirmCallback: async () => {
            await alovaInst.Post('yq/nameList', await formRef.value!.validate())
            useListRefresh('name')
            $msg.success('名单添加成功')
            pageListRef.value!.query()
          },
          width: 430,
        })
      },
      permission: 'yq:nameList:add',
    },
  ],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
