<script setup lang="ts">
import type { CardProps as _CardProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import { cardPropsInit } from './utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<CardProps>(), cardPropsInit)

export type CardProps = Omit<_CardProps, 'content'> & {
  bodyFullHeight?: boolean
  titleEllipsis?: boolean
}

const otherProps = computed(() => {
  const obj: Partial<CardProps> = {
    ...props,
  }

  delete obj.bodyFullHeight
  delete obj.titleEllipsis
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Card
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps(
          $attrs,
          {
            ...otherProps,
            ref: compoRef,
            bodyClassName: [bodyFullHeight ? 'flex-1' : '', otherProps.bodyClassName]
              .filter(Boolean)
              .join(' '),
          },
          {
            class: {
              'flex flex-col': bodyFullHeight,
              title_ellipsis: titleEllipsis,
            },
          },
        ),
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
.title_ellipsis {
  :deep() {
    .t-card__header-wrapper {
      @apply inline overflow-hidden;
    }

    .t-card__title {
      @apply overflow-hidden text-ellipsis whitespace-nowrap;
    }
  }
}
</style>
