<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next'

const globalConfig: GlobalConfigProvider = {}
const userStore = useUserStore()
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView></RouterView>
    <TWatermark
      class="pointer-events-none !absolute top-0 h-full"
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
