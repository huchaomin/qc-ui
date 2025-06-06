<script setup lang="ts">
const globalConfig = {

}
</script>

<template>
  <t-config-provider :global-config="globalConfig">
    <RouterView />
    <i-mdi:account-circle />
    <i-mdi:alpha-o-circle-outline />
    <i-line-md:alert-loop />
  </t-config-provider>
</template>
