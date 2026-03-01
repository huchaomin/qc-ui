<script lang="ts" setup>
/**
 * @description: https://icon-sets.iconify.design
 */
import { Icon } from '@iconify/vue'

export interface IconProps {
  icon: string
  size?: string
}

withDefaults(defineProps<IconProps>(), {
  size: '24',
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
