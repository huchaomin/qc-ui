<script setup lang="ts">
import type { ButtonProps } from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), {})
const otherProps = computed(() => {
  const obj: Partial<ButtonProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Button
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, otherProps, {
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>

<style scoped>
:deep() {
  .iconify {
    flex-shrink: 0;
    font-size: calc(1em + 4px) !important;

    &:has(+ .t-button__text) {
      @apply mr-2;
    }
  }
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-m);
}
</style>
