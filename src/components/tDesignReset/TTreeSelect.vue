<script setup lang="ts">
import type {
  TreeSelectProps as _TreeSelectProps,
  TreeOptionData,
  TreeSelectValue,
} from 'tdesign-vue-next'
import type { UseListTreeKey } from '@/hooks/useList'
import { mergeProps } from 'vue'

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<TreeSelectProps>(), {
  clearable: true,
  filterable: true,
})
const emit = defineEmits<{
  'update:modelValue': [value: TreeSelectValue]
}>()

export type TreeSelectProps = Omit<
  _TreeSelectProps,
  'data' | 'defaultInputValue' | 'defaultPopupVisible' | 'defaultValue' | 'modelValue' | 'value'
> & {
  data: TreeOptionData[] | UseListTreeKey
  modelValue: TreeSelectValue
}

type OnChangeParams = Parameters<NonNullable<_TreeSelectProps['onChange']>>
type OnInputChangeParams = Parameters<NonNullable<_TreeSelectProps['onInputChange']>>
type OnPopupVisibleChangeParams = Parameters<NonNullable<_TreeSelectProps['onPopupVisibleChange']>>

const finallyData = computed(() => {
  if (typeof props.data === 'string') {
    return useList(props.data).value
  }

  return props.data
})
const otherProps = computed(() => {
  const obj: Partial<TreeSelectProps> = {
    ...props,
  }

  obj.selectInputProps = {
    minCollapsedNum: 2,
    ...(obj.selectInputProps ?? {}),
  }
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const innerPopupVisible = defineModel<boolean>('popupVisible', {
  default: false,
})
const innerInputValue = defineModel<string>('inputValue', {
  default: '',
})
const compo = _TreeSelect
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const width = ref(0)

onMounted(() => {
  useResizeObserver(
    vm.exposed!.$el,
    () => {
      width.value = vm.exposed!.$el.offsetWidth
    },
    {
      box: 'border-box',
    },
  )
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, {
          ...otherProps,
          data: finallyData,
          ref: compoRef,
          onChange: (...args: OnChangeParams) => {
            emit('update:modelValue', args[0])
            props.onChange?.(...args)
          },
          inputValue: innerInputValue,
          onInputChange: (...args: OnInputChangeParams) => {
            innerInputValue = args[0]
            props.onInputChange?.(...args)
          },
          popupVisible: innerPopupVisible,
          onPopupVisibleChange: (...args: OnPopupVisibleChangeParams) => {
            innerPopupVisible = args[0]
            props.onPopupVisibleChange?.(...args)
          },
          popupProps: {
            ...(otherProps.popupProps ?? {}),
            overlayInnerStyle: (triggerElement: HTMLElement, popupElement: HTMLElement) => {
              return {
                width: 'auto',
                minWidth: `${width}px`,
                ...(typeof otherProps.popupProps?.overlayInnerStyle === 'function'
                  ? otherProps.popupProps.overlayInnerStyle(triggerElement, popupElement)
                  : (otherProps.popupProps?.overlayInnerStyle ?? {})),
              }
            },
          },
        }),
        $slots,
      )
    "
  >
  </component>
</template>
