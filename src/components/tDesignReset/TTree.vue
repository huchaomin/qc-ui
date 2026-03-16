<script lang="ts">
import type {
  TreeProps as _TreeProps,
  TreeInstanceFunctions,
  TreeNodeModel,
  TreeNodeValue,
  TreeOptionData,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'
import Icon from '../autoImport/Icon.vue'
import Button from './TButton.vue'

export const treePropsInit = {
  checkable: false,
  disabled: undefined,
  expandOnClickNode: undefined,
  hover: true,
  icon: () => (h: typeof import('vue').h, node: TreeNodeModel<TreeOptionData>) => {
    let iconName = ''

    // node.children is undefined on some cases

    if (node.getChildren && node.getChildren(false)) {
      if (node.expanded) {
        iconName = 'line-md:chevron-down-circle'

        if (node.loading) {
          iconName = 'line-md:loading-twotone-loop'
        }
      } else {
        iconName = 'line-md:chevron-right-circle'
      }
    }

    if (iconName === '') {
      return null
    }

    return h(
      Button,
      {
        shape: 'circle',
        style: 'font-size: 20px;',
        variant: 'text',
      },
      {
        icon: () => h(Icon, { icon: iconName }),
      },
    )
  },
  label: true,
  lazy: true,
  line: true,
  transition: true,
  valueMode: 'all',
} as const
export type TreeProps = Omit<_TreeProps, 'defaultValue' | 'value'>
</script>

<script setup lang="ts">
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeProps>(), treePropsInit)

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
