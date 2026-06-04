<script setup lang="ts">
import {
  formItemMap,
  useColumns,
} from '@/views/eventMgr/eventList/eventDetail/modules/EventDetail.vue'

const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    list: {
      method: 'yq/eventDetail/deleted/list',
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
            permission: 'yq:eventDetail:restore',
            popconfirm: {
              content: `确定要恢复【${row.title}】吗？`,
              onConfirm: async () => {
                await alovaInst.Put(`yq/eventDetail/restore/${row.id}`)
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
