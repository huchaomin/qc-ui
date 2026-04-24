<script lang="ts">
import type { TagProps as _TagProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import Icon from '@/components/autoImport/Icon.vue'

export const tagPropsInit = {
  size: 'medium',
} as const
export type TagProps = Omit<_TagProps, 'content' | 'icon'> & {
  icon?: _TagProps['icon'] | string
}
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TagProps>(), {
  ...tagPropsInit,
})
const otherProps = computed(() => {
  const obj: Partial<TagProps> = {
    ...props,
  }

  if (typeof obj.icon === 'string') {
    const icon = obj.icon
    const size = {
      large: '24',
      medium: '20',
      small: '16',
    }

    obj.icon = () => h(Icon, { icon, size: size[obj.size!] })
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Tag
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
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
