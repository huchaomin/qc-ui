<script setup lang="ts">
import type {
  TreeProps as _TreeProps,
  TreeInstanceFunctions,
  TreeNodeValue,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeProps>(), {
  checkable: false,
  expandOnClickNode: undefined,
  hover: true,
  icon: true,
  label: true,
  lazy: true,
  transition: true,
  valueMode: 'all',
})

export type TreeProps = Omit<_TreeProps, 'defaultValue' | 'value'>

type OnActiveParams = Parameters<NonNullable<_TreeProps['onActive']>>
type OnChangeParams = Parameters<NonNullable<_TreeProps['onChange']>>
type OnExpandParams = Parameters<NonNullable<_TreeProps['onExpand']>>

const innerModelValue = defineModel<TreeNodeValue[]>('modelValue', {
  default: () => [],
})
const innerActived = defineModel<TreeNodeValue[]>('actived', {
  default: () => [],
})
const innerExpanded = defineModel<TreeNodeValue[]>('expanded', {
  default: () => [],
})
const otherProps = computed(() => {
  const obj: Partial<TreeProps> = {
    ...props,
  }

  obj.expandOnClickNode = obj.expandOnClickNode ?? !obj.checkable
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Tree
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

defineExpose({} as TreeInstanceFunctions)
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
          actived: innerActived,
          expanded: innerExpanded,
          onChange: (...args: OnChangeParams) => {
            innerModelValue = args[0]
            props.onChange?.(...args)
          },
          onActive: (...args: OnActiveParams) => {
            innerActived = args[0]
            props.onActive?.(...args)
          },
          onExpand: (...args: OnExpandParams) => {
            innerExpanded = args[0]
            props.onExpand?.(...args)
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>
