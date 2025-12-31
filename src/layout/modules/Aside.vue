<script setup lang="ts">
import MenuNode from './MenuNode.vue'

const route = useRoute()
const commonStore = useCommonStore()
const appName = VITE_APP_NAME
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
  <TAside
    :width="commonStore.drawerOpen ? undefined : '0px'"
    class="overflow-hidden border-r border-r-[var(--td-border-level-2-color)]"
  >
    <TMenu :value="value" :default-expanded="defaultExpanded">
      <template #logo>
        <div class="!ml-2 flex items-center">
          <TImage :src="logoUrl" class="logo" style="width: 28px; height: 28px"></TImage>
          <GradientText
            :text="appName"
            :animation-speed="8"
            :show-border="false"
            class-name="ml-2 text-xl !font-bold"
          />
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

  .t-menu__logo {
    height: var(--td-comp-size-xxl) !important;
    border-bottom: none !important;
  }

  .t-menu {
    @apply !py-0;
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

    .t-menu__sub {
      .t-menu__item {
        padding-left: var(--padding-left, 32px) !important;
      }
    }
  }
}
</style>
