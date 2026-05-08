<script setup lang="ts">
const columns: TableCol[] = [
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'points_change_type',
    },
    colKey: 'changeType',
    title: '功能类型',
  },
  {
    colKey: 'points',
    title: '使用积分',
  },
  {
    cell: (_, { row }) => {
      return useSysUser(row.employeeId).value?.userName
    },
    colKey: 'employeeId',
    title: '用户',
  },
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'point_status',
    },
    colKey: 'pointStatus',
    title: '积分状态',
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
]
</script>

<template>
  <PageTable
    method="yq/pointsRecord/list"
    :columns="columns"
    :query-params="{
      changeType: '99',
    }"
  >
  </PageTable>
</template>
