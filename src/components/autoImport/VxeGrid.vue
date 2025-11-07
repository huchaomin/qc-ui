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
  <VxeGrid v-bind="gridOptions" />
</template>
