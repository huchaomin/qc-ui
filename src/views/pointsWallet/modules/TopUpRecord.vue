<script setup lang="ts">
const columns: TableCol[] = [
  {
    cell: {
      _component: 'DicLabel',
      dicCode: 'points_change_type',
    },
    colKey: 'changeType',
    title: '变更类型',
  },
  {
    colKey: 'amount',
    title: '充值金额',
  },
  {
    colKey: 'points',
    title: '充值积分',
  },
  {
    cell: (_, { row }) => {
      return useSysUser(row.employeeId).value?.userName
    },
    colKey: 'employeeId',
    title: '充值用户',
  },
  {
    colKey: 'currentPoints',
    title: '当前积分',
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
      changeType: '0',
    }"
  >
  </PageTable>
</template>
