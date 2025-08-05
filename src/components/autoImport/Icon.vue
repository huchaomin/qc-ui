<script lang="ts" setup>
/**
 * @description: https://icon-sets.iconify.design/?category=UI+24px
 */
import { Icon } from '@iconify/vue'

defineProps({
  icon: {
    required: true,
    type: String,
  },
  size: {
    default: '24',
    type: String,
  },
})
</script>

<template>
  <Icon
    :icon="icon"
    :style="{
      fontSize: `${size}px`,
    }"
    inline
  ></Icon>
</template>
