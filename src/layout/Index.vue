<script setup lang="ts">
import { getRoute } from '@/router/index'
import Aside from './modules/Aside.vue'
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
</script>

<template>
  <TLayout class="h-full">
    <Aside>Aside</Aside>
    <TLayout class="!flex-1 overflow-x-auto">
      <Header></Header>
      <TContent>
        <RouterView v-slot="{ Component }">
          <KeepAlive
            :include="recentRoutersNames"
            :exclude="excludeKPnameStore.excludeKPname"
          >
            <Component :is="Component"></Component>
          </KeepAlive>
        </RouterView>
      </TContent>
    </TLayout>
  </TLayout>
</template>
