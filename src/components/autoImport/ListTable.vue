<script setup lang="ts">
import { ListTable } from '@visactor/vue-vtable'

const option = {
  header: [
    {
      caption: '名称',
      field: '0',
    },
    {
      caption: '年龄',
      field: '1',
    },
    {
      caption: '性别',
      field: '2',
    },
    {
      caption: '爱好',
      field: '3',
    },
  ],
  records: Array.from({ length: 1000 }).fill(['张三', 18, '男', '🏀']),
}
</script>

<template>
  <ListTable :options="option" />
</template>
