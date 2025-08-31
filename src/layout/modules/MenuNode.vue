<script setup lang="ts">
withDefaults(
  defineProps<{
    level?: number
    model: RouteRecordRaw[]
  }>(),
  {
    level: 0,
  },
)

function getIcon(item: RouteRecordRaw) {
  return item.meta.icon || 'solar:menu-dots-bold-duotone'
}
</script>

<script lang="ts">
export default {
  name: 'MenuNode',
}
</script>

<template>
  <template v-for="item in model" :key="item.name">
    <template v-if="item.meta.hidden !== true">
      <TSubmenu v-if="item.children" :value="item.name" :title="item.meta.title">
        <template v-if="level === 0" #icon>
          <Icon :icon="getIcon(item)" class="mr-2.5"></Icon>
        </template>
        <MenuNode :model="item.children" :level="level + 1"></MenuNode>
      </TSubmenu>

      <TMenuItem v-else :to="{ name: item.name, query: { _fromLeftTree: 'true' } }" :value="item.name">
        <template v-if="level === 0" #icon>
          <Icon :icon="getIcon(item)" class="mr-2.5"></Icon>
        </template>
        {{ item.meta.title }}
      </TMenuItem>
    </template>
  </template>
</template>
