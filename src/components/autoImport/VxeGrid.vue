<script lang="ts" setup>
import type { VxeGridProps } from 'vxe-table'

interface RowVO {
  address: string
  age: number
  name: string
  role: string
  sex: string
}

function getItem() {
  return {
    address: 'test ',
    age: 28,
    name: 'Test1',
    role: 'Develop',
    sex: 'Man',
  }
}

const data = Array.from({ length: 100 }).map(getItem)
const gridOptions = reactive<VxeGridProps<RowVO>>({
  columns: [
    { type: 'seq', width: 70 },
    { field: 'name', title: 'Name' },
    { field: 'sex', title: 'Sex' },
    { field: 'age', title: 'Age' },
    {
      field: 'role',
      title:
        'RoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRoleRole',
    },
    { field: 'address', title: 'AddressAddressAddress' },
  ],
  data,
})
</script>

<template>
  <!-- <VxeGrid v-bind="gridOptions" /> -->
  <TTable
    :data="gridOptions.data"
    table-layout="auto"
    :height="500"
    row-key="index"
    :columns="[
      { width: 80, colKey: 'name', title: 'Name' },
      { width: 80, colKey: 'sex', title: 'Sex' },
      {
        width: 80,
        maxWidth: 200,
        colKey: 'age',
        title: 'AgeAgeAgeAg eAgeAgeAgeAgeAgeAgeAgeAgeAgeA',
        ellipsis: true,
        ellipsisTitle: true,
      },
      {
        width: 80,
        colKey: 'role',
        title: 'RoleRoleRole',
      },
      { width: 80, colKey: 'address', title: 'AddressAddressAddress' },
    ]"
  />
</template>

<style>
.t-table {
  width: 80%;
  margin: 0 auto;

  th,
  td {
    white-space: nowrap;
  }
}
</style>
