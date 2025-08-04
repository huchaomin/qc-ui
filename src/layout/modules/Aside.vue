<script setup lang="ts">
import MenuNode from './MenuNode.vue'

const route = useRoute()
const router = useRouter()
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
  return route.matched.map(item => item.name as string)
})
const value = computed({
  get() {
    const meta = route.meta
    const { hidden, parentName } = meta

    if (parentName !== '' && hidden === true) {
      return parentName
    }

    return route.name as string
  },
  set(val: string) {
    router.push({ name: val })
  },
})
console.log(routerStore.routersRaw)
</script>

<template>
  <TAside>
    <TMenu v-model="value" :default-expanded="defaultExpanded">
      <template #logo>
        <div class="flex items-center">
          <TImage :src="logoUrl" class="logo" style="width: 32px; height: 32px;"></TImage>
          <TTypographyTitle level="h4" class="!ml-2 !my-0">{{ appName }}</TTypographyTitle>
        </div>
      </template>
      <MenuNode :model="routerStore.routersRaw[0].children!"></MenuNode>
    </TMenu>
  </TAside>
</template>
