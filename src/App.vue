<script setup lang="ts">
const globalConfig = {

}
</script>

<template>
  <t-config-provider :global-config="globalConfig">
    <RouterView />
  </t-config-provider>
</template>
