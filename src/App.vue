<script setup lang="ts">
const component = resolveComponent('TMessage')
$loading.show('aaa')
setTimeout(() => {
  $loading.show('bbb')
  setTimeout(() => {
    $loading.show()
    setTimeout(() => {
      $loading.hide()
      $loading.hide()
      $loading.hide()
    }, 1000)
  }, 1000)
}, 1000)
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
