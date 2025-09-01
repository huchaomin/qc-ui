<script setup lang="ts">
import Aside from './modules/Aside.vue'
import Header from './modules/Header.vue'

const router = useRouter()
const recentRoutersStore = useRecentRoutersStore()
const excludeKPnameStore = useExcludeKPnameStore()
const recentRoutersNames = computed(() =>
  recentRoutersStore.recentRouters
    .filter((r) => {
      if (router.hasRoute(r.name)) {
        return router.resolve({ name: r.name }).meta.noCache !== true
      }

      return false
    })
    .map((r) => r.name),
)
</script>

<template>
  <TLayout class="h-full">
    <Aside>Aside</Aside>
    <TLayout>
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
