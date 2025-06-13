<script setup lang="ts">
const globalConfig = {

}
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <RouterView></RouterView>
  </TConfigProvider>
</template>
