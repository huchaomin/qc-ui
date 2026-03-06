<script setup lang="ts">
import type { PopupProps as _PopupProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<PopupProps>(), {
  hideEmptyPopup: true,
  showArrow: true,
})

export type PopupProps = Omit<_PopupProps, 'defaultVisible' | 'visible'>

type OnVisibleChangeParams = Parameters<NonNullable<_PopupProps['onVisibleChange']>>

const otherProps = computed(() => {
  const obj: Partial<PopupProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  console.log(obj)
  return obj
})
const compo = _Popup
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const innerModelValue = defineModel<boolean>('modelValue', {
  default: false,
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          ref: compoRef,
          modelValue: innerModelValue,
          onVisibleChange: (...args: OnVisibleChangeParams) => {
            innerModelValue = args[0]
            props.onVisibleChange?.(...args)
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>
