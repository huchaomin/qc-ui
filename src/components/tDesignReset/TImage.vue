<script setup lang="ts">
import type { ImageProps } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<ImageProps>(),
  {
    lazy: true,
  },
)
const compo = Image
</script>

<template>
  <component :is="compo" v-bind="props">
    <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
      <slot :name="k" v-bind="slotScope"></slot>
    </template>
  </component>
</template>

<style scoped>
.t-image__wrapper{
  background: transparent;
}
</style>
