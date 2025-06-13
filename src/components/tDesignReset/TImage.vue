<script setup lang="ts">
import type { ImageProps } from 'tdesign-vue-next'

withDefaults(
  defineProps<ImageProps>(),
  {
    lazy: true,
  },
)
const compo = Image
</script>

<template>
  <component :is="compo" v-bind="$attrs" :lazy="lazy"></component>
</template>
