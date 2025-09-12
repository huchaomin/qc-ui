<!--
 * @Author       : huchaomin peter@qingcongai.com
 * @Date         : 2023-12-02 11:08:16
 * @LastEditors  : peterhu peter@qcznai.com
 * @LastEditTime : 2025-09-12 10:27:43
 * @Description  :
-->
<script setup lang="ts">
import { getRoute } from '@/router/index'

const route = useRoute()
// 这里的路由不能包含任何跳转参数
const items = computed(() => {
  const name = route.name as string
  const { hidden, parentName } = route.meta
  let mapArr: string[] = []

  if (hidden === true && !['NotFound'].includes(name)) {
    mapArr = [parentName, name]
  }

  return mapArr.map((name) => {
    return {
      name,
      query: {
        _fromBreadcrumb: 'true',
      },
      title: getRoute(name)!.meta.title,
    }
  })
})

defineExpose({
  items,
})
</script>

<template>
  <TBreadcrumb v-if="items.length > 0" class="absolute z-10 !px-4 !py-1">
    <TBreadcrumbItem
      v-for="item in items"
      :key="item.name"
      :to="
        item.name === route.name
          ? undefined
          : {
              name: item.name,
              query: item.query,
            }
      "
    >
      {{ item.title }}
    </TBreadcrumbItem>
  </TBreadcrumb>
</template>
