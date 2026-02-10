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
  <TPopconfirm v-if="props.popconfirm" v-bind="props.popconfirm">
    <component
      :is="
        withDirectives(
          h(
            compo,
            mergeProps(
              $attrs,
              {
                ...otherProps,
                ref: compoRef,
              },
              {
                class: 'flex-shrink-0',
              },
            ),
            $slots,
          ),
          [[resolveDirective('permission'), props.permission]],
        )
      "
    ></component>
  </TPopconfirm>
  <component
    :is="
      withDirectives(
        h(
          compo,
          mergeProps(
            $attrs,
            {
              ...otherProps,
              ref: compoRef,
            },
            {
              class: 'flex-shrink-0',
            },
          ),
          $slots,
        ),
        [[resolveDirective('permission'), props.permission]],
      )
    "
    v-else
  ></component>
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
