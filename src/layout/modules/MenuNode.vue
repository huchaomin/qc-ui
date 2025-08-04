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

// TODO
function getIcon(item: RouteRecordRaw) {
  if (item.meta.icon) {
    return resolveComponent(item.meta.icon)
  }

  return resolveComponent('i-material-symbols:nest-clock-farsight-analog-outline')
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
          <component :is="getIcon(item)"></component>
        </template>
        <MenuNode :model="item.children" :level="level + 1"></MenuNode>
      </TSubmenu>

      <TMenuItem
        v-else
        :to="{ name: item.name, query: { _fromLeftTree: 'true' } }"
        :value="item.name"
      >
        <template v-if="level === 0" #icon>
          <component :is="getIcon(item)"></component>
        </template>
        {{ item.meta.title }}
      </TMenuItem>
    </template>
  </template>
</template>
