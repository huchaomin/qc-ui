<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next'

const globalConfig: GlobalConfigProvider = {
  table: {
    treeExpandAndFoldIcon: (h, { type }) => {
      const icon = resolveComponent('Icon')
      const button = resolveComponent('TButton')

      return h(
        button,
        {
          shape: 'circle',
          variant: 'text',
        },
        {
          icon: () => h(icon, { icon: `line-md:chevron-${type === 'expand' ? 'right' : 'down'}` }),
        },
      )
    },
  },
}
const userStore = useUserStore()
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView class="relative z-0"></RouterView>
    <TWatermark
      class="pointer-events-none absolute! top-0 z-[calc(Infinity)] h-full"
      :watermark-content="[
        { text: userStore.userInfo.userName ?? '' },
        {
          text: userStore.userInfo.nickName ?? '',
        },
      ]"
      :y="100"
      :x="50"
      :removable="false"
      :line-space="24"
      :width="120"
      :height="60"
    >
    </TWatermark>
  </TConfigProvider>
</template>
