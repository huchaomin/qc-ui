<script setup lang="ts">
import type { CardProps } from 'tdesign-vue-next'

const props = withDefaults(
  defineProps<CardProps>(),
  {
    shadow: true,
  },
)
const compo = Card
</script>

<template>
  <component :is="compo" v-bind="props">
    <template v-for="k in Object.keys($slots)" :key="k" #[k]="slotScope">
      <slot :name="k" v-bind="slotScope"></slot>
    </template>
  </component>
</template>
