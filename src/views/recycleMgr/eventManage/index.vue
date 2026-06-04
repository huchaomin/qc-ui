<script setup lang="ts">
import { formItemMap, useColumns } from '@/views/eventMgr/eventList/index.vue'

const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    list: {
      method: 'yq/eventManage/deleted/list',
    },
  },
  columns: [
    ...useColumns(),
    {
      cell: {
        _component: 'Buttons',
        buttons: [
          ({ row }) => ({
            default: '恢复',
            permission: 'yq:eventManage:restore',
            popconfirm: {
              content: `确定要恢复【${row.eventName}】吗？`,
              onConfirm: async () => {
                await alovaInst.Put(`yq/eventManage/restore/${row.id}`)
                useListRefresh('eventManage')
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
  formItems: [formItemMap.eventName],
}
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
