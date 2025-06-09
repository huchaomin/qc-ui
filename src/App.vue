<script setup lang="ts">
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
        </TContent>
      </TLayout>
    </TLayout>
    <RouterView></RouterView>
  </TConfigProvider>
</template>
