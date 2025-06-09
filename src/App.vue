<script setup lang="ts">
const component = resolveComponent('i-line-md:check-list-3-twotone')

const globalConfig = {

}
</script>

<template>
  <TConfigProvider :global-config="globalConfig">
    <TLayout class="h-full">
      <TAside>Aside</TAside>
      <TLayout>
        <THeader>Header</THeader>
        <TContent>
          <i-line-md:alert-loop></i-line-md:alert-loop>
          <component :is="component"></component>
        </TContent>
      </TLayout>
    </TLayout>
    <RouterView></RouterView>
  </TConfigProvider>
</template>
