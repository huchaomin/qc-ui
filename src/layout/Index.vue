<script setup lang="ts">
import Aside from './modules/Aside.vue'
</script>

<template>
  <TLayout class="h-full">
    <Aside>Aside</Aside>
    <TLayout>
      <THeader>Header</THeader>
      <TContent>
        <RouterView></RouterView>
      </TContent>
    </TLayout>
  </TLayout>
</template>
