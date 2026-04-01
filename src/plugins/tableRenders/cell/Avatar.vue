<script setup lang="ts">
import type { AvatarProps as _AvatarProps } from 'tdesign-vue-next'
import type { CellRenderContext } from '@/components/tDesignReset/TTable.vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<AvatarProps>(), {
  hideOnLoadFailed: true,
})
const attrs = useAttrs() as unknown as CellRenderContext
const bindProps = computed(() => {
  const obj: Partial<AvatarProps> = {
    ...props,
    image: isFalsy(props.image) ? _get(attrs.row, attrs.col.colKey) : props.image,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})

export type AvatarProps = _AvatarProps
</script>

<template>
  <TAvatar
    v-if="!isFalsy(bindProps.image) || !isFalsy(bindProps.content) || !isFalsy(bindProps.default)"
    v-bind="bindProps"
  ></TAvatar>
</template>
