<script setup lang="ts">
import type { TableCol } from '@/components/tDesignReset/TTable.vue'

const props = withDefaults(
  defineProps<{
    roleId: string
    tableCol: TableCol[]
  }>(),
  {},
)
const pageListRef = useTemplateRef('pageListRef')
const config: PageListProps = {
  apis: {
    list: {
      method: (o: Record<string, any>) => {
        return alovaInst.Get('system/role/authUser/unallocatedList', {
          params: {
            ...o,
            roleId: props.roleId,
          },
        })
      },
    },
  },
  cardProps: {
    bodyClassName: 'p-0!',
    shadow: false,
  },
  columns: props.tableCol,
  formItems: [
    {
      _label: '用户名称',
      model: 'userName',
    },
    {
      _label: '手机号码',
      model: 'phonenumber',
    },
  ],
  tableOtherProps: {
    flexHeight: false,
    rowKey: 'userId',
    showColumnConfigBtn: false,
    showRowSelect: 'multiple',
    showToggleFullscreenBtn: false,
  },
}

async function handleSubmit(): Promise<void> {
  const idArr = pageListRef.value!.selectedRowKeys

  if (idArr.length === 0) {
    $msg.error('请选择要分配的用户')
    return Promise.reject()
  }

  await alovaInst.Put(
    'system/role/authUser/selectAll',
    {},
    {
      params: {
        roleId: props.roleId,
        userIds: idArr.join(','),
      },
    },
  )
  $msg('分配用户成功')
}

defineExpose({
  handleSubmit,
})
</script>

<template>
  <PageList ref="pageListRef" v-bind="config"></PageList>
</template>
