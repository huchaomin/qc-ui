<script setup lang="ts">
import { useAutoAnimate } from '@formkit/auto-animate/vue'
import { getRoute } from '@/router/index'
import Aside from './modules/Aside.vue'
import Breadcrumb from './modules/Breadcrumb.vue'
import Header from './modules/Header.vue'

const route = useRoute()
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
const noMainPadding = computed(() => {
  return ['Home', 'NotFound'].includes(route.name as string)
})
const [contentRef] = useAutoAnimate((el, action) => {
  let keyframes: Keyframe[] = []

  if (action === 'add') {
    keyframes = [
      {
        opacity: 0,
      },
      { opacity: 1 },
    ]
  }

  if (action === 'remove') {
    keyframes = [
      { opacity: 1 },
      {
        opacity: 0,
      },
    ]
  }

  return new KeyframeEffect(el, keyframes, { duration: 400, easing: 'ease-in-out' })
})
</script>

<template>
  <TLayout class="h-full">
    <Aside>Aside</Aside>
    <TLayout class="!flex-1 overflow-x-auto">
      <Header></Header>
      <TContent
        ref="contentRef"
        :class="{ '!p-4': !noMainPadding, '!pt-8': hasBreadcrumb }"
        class="relative"
      >
        <Breadcrumb ref="breadcrumb"></Breadcrumb>
        <RouterView v-slot="{ Component }">
          <KeepAlive :include="recentRoutersNames" :exclude="excludeKPnameStore.excludeKPname">
            <Component :is="Component" class="min-h-full"></Component>
          </KeepAlive>
        </RouterView>
      </TContent>
    </TLayout>
  </TLayout>
</template>

<style scoped>
.t-layout__content {
  overflow-y: auto;

  &:has(> [style*='transform-origin: center center']) {
    overflow-y: hidden;
  }
}
</style>
