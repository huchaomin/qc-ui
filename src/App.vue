<script setup lang="ts">
import type { GlobalConfigProvider } from 'tdesign-vue-next'

const globalConfig: GlobalConfigProvider = {
}
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView></RouterView>
  </TConfigProvider>
</template>
