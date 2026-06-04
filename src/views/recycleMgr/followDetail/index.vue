<script setup lang="ts">
import { formItemMap, useColumns } from '@/views/followMgr/detail/modules/FollowDetail.vue'

const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    list: {
      method: 'yq/followDetail/deleted/list',
    },
  },
  columns: [
    ...useColumns().map((item) => ({
      ...item,
      sorter: false,
    })),
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '恢复',
            popconfirm: {
              content: `确定要恢复【${row.title}】吗？`,
              onConfirm: async () => {
                await alovaInst.Put(`yq/followDetail/restore/${row.id}`)
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
  formItems: [formItemMap.title],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
