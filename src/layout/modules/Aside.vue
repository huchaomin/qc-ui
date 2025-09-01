<script setup lang="ts">
import MenuNode from './MenuNode.vue'

const route = useRoute()
const appName = import.meta.env.VITE_APP_NAME
const logoUrl = Object.values(
  import.meta.glob('img/side_logo.*', {
    eager: true,
    import: 'default',
    query: '?url',
  }),
)[0] as string
const routerStore = useRouterStore()
const defaultExpanded = computed(() => {
  return route.matched.map((item) => item.name as string)
})
const value = computed(() => {
  const meta = route.meta
  const { hidden, parentName } = meta

  if (parentName !== '' && hidden === true) {
    return parentName
  }

  return route.name as string
})
console.log(routerStore.routersRaw)
</script>

<template>
  <TAside>
    <TMenu :value="value" :default-expanded="defaultExpanded">
      <template #logo>
        <div class="flex items-center">
          <TImage
            :src="logoUrl"
            class="logo"
            style="width: 32px; height: 32px"
          ></TImage>
          <TTypographyTitle level="h4" class="!my-0 !ml-2">{{
            appName
          }}</TTypographyTitle>
        </div>
      </template>
      <MenuNode :model="routerStore.routersRaw[0]!.children!"></MenuNode>
    </TMenu>
  </TAside>
</template>

<style scoped>
:deep() {
  .t-default-menu__inner {
    .t-menu {
      padding: 4px 0;
    }
  }

  .t-default-menu {
    .t-menu__item {
      height: var(--td-comp-size-xl);
      padding: 0 10px;
      line-height: var(--td-comp-size-xl);

      &.t-is-active {
        color: var(--td-brand-color);
      }
    }
  }
}
</style>
