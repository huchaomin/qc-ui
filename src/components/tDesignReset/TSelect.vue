<script setup lang="ts">
import type {
  SelectProps as _SelectProps,
  SelectOption,
  SelectOptionGroup,
  SelectValue,
} from 'tdesign-vue-next'
import type { UseListKey } from '@/hooks/useList'
import { mergeProps } from 'vue'

export type SelectProps = Omit<
  _SelectProps,
  'defaultInputValue' | 'defaultPopupVisible' | 'defaultValue' | 'options' | 'value'
> & {
  dicCode?: string
  modelValue: SelectValue
  options?: SelectOption[] | UseListKey
  showCheckAll?: boolean
}

type OnChangeParams = Parameters<NonNullable<_SelectProps['onChange']>>
type OnInputChangeParams = Parameters<NonNullable<_SelectProps['onInputChange']>>
type OnPopupVisibleChangeParams = Parameters<NonNullable<_SelectProps['onPopupVisibleChange']>>
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps>(), {
  clearable: true,
  filterable: true,
  inputValue: undefined,
  keys: () => ({
    disabled: 'disabled',
    label: 'label',
    value: 'value',
  }),
  minCollapsedNum: 2,
  /**
   * @description: 是否多选
   */
  multiple: false,
  placeholder: '请选择',
  /**
   * @description: 是否显示下拉框
   */
  popupVisible: undefined,
  /**
   * @description: 阈值 大于等于 150 时，启用虚拟滚动
   */
  scroll: () => ({
    threshold: 150,
    type: 'virtual',
  }),
  /**
   * @description: 是否显示右侧箭头
   */
  showArrow: true,
  /**
   * @description: 是否显示全选
   */
  showCheckAll: false,
})
const emit = defineEmits<{
  'update:inputValue': [value: string]
  'update:modelValue': [value: SelectValue]
  'update:popupVisible': [value: boolean]
}>()
const compo = _Select
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
}

const finallyOptions = computed(() => {
  let arr

  if (props.dicCode) {
    if (props.options) {
      $notify.error('TSelect: dicCode and options cannot be used together')
    }

    arr = useDicOptions(props.dicCode).value
  } else {
    arr = typeof props.options === 'string' ? useList(props.options).value : props.options
  }

  if (props.showCheckAll) {
    if (!props.multiple) {
      $notify.error('TSelect: showCheckAll is supported only for multiple select')
    } else {
      if (arr === undefined) {
        $notify.error('TSelect: options is required, when showCheckAll is true')
      } else {
        ;(arr as SelectOption[]).unshift({
          checkAll: true,
          [props.keys?.label ?? 'label']: '全选',
        })
      }
    }
  }

  return arr
})
const innerModelValue = computed(() => {
  if (finallyOptions.value !== undefined) {
    const flatOptions = (finallyOptions.value as SelectOption[]).flatMap(
      (item) => (item as SelectOptionGroup).children ?? [item],
    )
    const valueKey = props.keys?.value ?? 'value'
    const isString = flatOptions.every((item: any) => typeof item[valueKey] === 'string')
    const isNumber = flatOptions.every((item: any) => typeof item[valueKey] === 'number')

    if (props.multiple) {
      if (Array.isArray(props.modelValue)) {
        if (isString) {
          return (props.modelValue as SelectValue[]).map((v) => (isFalsy(v) ? v : String(v)))
        } else if (isNumber) {
          return (props.modelValue as SelectValue[]).map((v) =>
            isFalsy(v) || Number.isNaN(Number(v)) ? v : Number(v),
          )
        }
      } else {
        $notify.error('TSelect: modelValue must be an array, when multiple is true')
      }
    } else {
      if (isString) {
        return isFalsy(props.modelValue) ? props.modelValue : String(props.modelValue)
      } else if (isNumber) {
        return isFalsy(props.modelValue) || Number.isNaN(Number(props.modelValue))
          ? props.modelValue
          : Number(props.modelValue)
      }
    }
  }

  return props.modelValue
})
const otherProps = computed(() => {
  const obj: Partial<SelectProps> = {
    ...props,
  }

  delete obj.dicCode
  delete obj.showCheckAll
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
// const { width } = useElementSize(() => vm.exposed!.$el) // 为什么会多出 一点宽度呢？
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
          options: finallyOptions,
          modelValue: innerModelValue,
          onChange: (...args: OnChangeParams) => {
            emit('update:modelValue', args[0])
            props.onChange?.(...args)
          },
          popupVisible: innerPopupVisible,
          onPopupVisibleChange: (...args: OnPopupVisibleChangeParams) => {
            innerPopupVisible = args[0]
            props.onPopupVisibleChange?.(...args)
          },
          inputValue: innerInputValue,
          onInputChange: (...args: OnInputChangeParams) => {
            innerInputValue = args[0]
            props.onInputChange?.(...args)
          },
          ref: compoRef,
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
