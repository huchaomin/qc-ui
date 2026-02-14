<script setup lang="ts">
import type { ButtonProps as _ButtonProps } from 'tdesign-vue-next'
import type { PopconfirmProps } from '@/components/tDesignReset/TPopconfirm.vue'
import { mergeProps, resolveDirective, withDirectives } from 'vue'
import { buttonPropsInit } from '@/components/tDesignReset/utils'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<ButtonProps>(), buttonPropsInit)

export type ButtonProps = Omit<_ButtonProps, 'content'> & {
  permission?: Parameters<typeof checkPermissions>[0]
  popconfirm?: Omit<PopconfirmProps, 'default'>
  /**
   * @description: 按钮是否渲染，默认 true
   */
  show?: boolean
}

const otherProps = computed(() => {
  const obj: Partial<ButtonProps> = {
    ...props,
  }

  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  delete obj.permission
  delete obj.popconfirm
  delete obj.show
  return obj
})
const compo = _Button
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const TButtonComponent = computed(() => {
  const vNode = h(
    compo,
    mergeProps(
      useAttrs(),
      {
        ...otherProps.value,
        ref: compoRef,
      },
      {
        class: 'flex-shrink-0',
      },
    ),
    useSlots(),
  )

  return withDirectives(vNode, [[resolveDirective('permission'), props.permission]])
})
</script>

<template>
  <template v-if="props.show">
    <TPopconfirm v-if="props.popconfirm" v-bind="props.popconfirm">
      <TButtonComponent></TButtonComponent>
    </TPopconfirm>
    <TButtonComponent v-else></TButtonComponent>
  </template>
</template>

<style scoped>
:deep() {
  .iconify {
    flex-shrink: 0;
    font-size: calc(1em + 8px) !important;

    &:has(+ .t-button__text) {
      @apply mr-2;
    }
  }
}

.t-button + .t-button {
  margin-left: var(--td-comp-margin-m);
}
</style>
