<script setup lang="ts">
import type { AvatarProps as _AvatarProps } from 'tdesign-vue-next'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AvatarProps>(), {
  hideOnLoadFailed: true,
})
const otherProps = computed(() => {
  const obj: Partial<AvatarProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})

export type AvatarProps = _AvatarProps

const attrs = useAttrs() as unknown as CellRenderContext
</script>

<template>
  <TAvatar
    v-bind="{
      image: _get(attrs.row, attrs.col.colKey),
      ...otherProps,
    }"
  >
  </TAvatar>
</template>
