<script setup lang="ts">
import { getRoute } from '@/router/index'
import Aside from './modules/Aside.vue'
import Breadcrumb from './modules/Breadcrumb.vue'
import Header from './modules/Header.vue'

const recentRoutersStore = useRecentRoutersStore()
const excludeKPnameStore = useExcludeKPnameStore()
const recentRoutersNames = computed(() =>
  recentRoutersStore.recentRouters
    .filter((r) => {
      return getRoute(r.name)!.meta.noCache === false
    })
    .map((r) => r.name),
)
const breadcrumbRef = useTemplateRef('breadcrumb')
const hasBreadcrumb = computed(() => {
  return (breadcrumbRef.value?.items.length ?? 0) > 0
})
</script>

<template>
  <TLayout class="h-full">
    <Aside>Aside</Aside>
    <TLayout class="!flex-1 overflow-x-auto">
      <Header></Header>
      <TContent class="overflow-auto">
        <Breadcrumb ref="breadcrumb"></Breadcrumb>
        <RouterView v-slot="{ Component }">
          <KeepAlive
            :include="recentRoutersNames"
            :exclude="excludeKPnameStore.excludeKPname"
          >
            <Component
              :is="Component"
              :class="{ 'pt-8': hasBreadcrumb }"
              class="min-h-full p-4"
            ></Component>
          </KeepAlive>
        </RouterView>
      </TContent>
    </TLayout>
  </TLayout>
</template>
