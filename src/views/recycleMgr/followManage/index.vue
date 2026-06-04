<script setup lang="ts">
const pageListRef = useTemplateRef('pageListRef')
const formItemMap = {
  brandId: {
    _label: '品牌',
    component: 'TSelect',
    model: 'brandId',
    options: 'brand',
  },
  name: {
    _label: '组名称',
    model: 'name',
  },
} satisfies Record<string, FormItem>
const config: PageListProps = {
  apis: {
    list: {
      method: 'yq/followManage/deleted/list',
    },
  },
  columns: [
    {
      colKey: 'name',
      title: '组名称',
    },
    {
      cell: {
        _component: 'OptionLabel',
        options: 'brand',
      },
      colKey: 'brandId',
      title: '品牌',
    },
    {
      cell: {
        _component: 'DicLabel',
        dicCode: 'check_video_flag',
      },
      colKey: 'checkVideoFlag',
      title: '是否检查视频',
    },
    {
      cell: {
        _component: 'OptionLabel',
        options: 'followFolder',
      },
      colKey: 'folderId',
      title: '所属文件夹',
    },
    {
      colKey: 'followTotal',
      title: '关注数量',
    },
    {
      colKey: 'platforms',
      title: '涉及平台',
    },
    {
      colKey: 'sortOrder',
      title: '排序',
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
      colKey: 'updateTime',
      title: '更新时间',
    },
    {
      colKey: 'updateBy',
      title: '更新人',
    },
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '恢复',
            permission: 'yq:followManage:restore',
            popconfirm: {
              content: `确定要恢复【${row.name}】关注组吗？`,
              onConfirm: async () => {
                await alovaInst.Put(`yq/followManage/restore/${row.id}`)
                useListRefresh('follow')
                $msg('恢复成功')
                pageListRef.value!.query()
              },
            },
          }),
        ],
      },
      colKey: '_operation',
      title: '操作',
    },
  ],
  formItems: [formItemMap.name, formItemMap.brandId],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
