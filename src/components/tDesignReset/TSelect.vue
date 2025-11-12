<script setup lang="ts">
import type {
  SelectProps as _SelectProps,
  SelectOptionGroup,
  SelectValue,
  TdOptionProps,
} from 'tdesign-vue-next'
import { mergeProps } from 'vue'

export type SelectProps = Omit<
  _SelectProps,
  | 'defaultInputValue'
  | 'defaultPopupVisible'
  | 'defaultValue'
  | 'inputValue'
  | 'modelValue'
  | 'popupVisible'
  | 'value'
> & {
  dicCode?: string
  showCheckAll?: boolean
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<SelectProps>(), {
  clearable: true,
  filterable: true,
  keys: () => ({
    disabled: 'disabled',
    label: 'label',
    value: 'value',
  }),
  /**
   * @description: 是否多选
   */
  multiple: false,
  placeholder: '请选择',
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
const compo = _Select
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const finallyOptions = computed(() => {
  let arr

  if (props.dicCode) {
    if (props.options) {
      $notify.error('TSelect: dicCode and options cannot be used together')
    }

    arr = useDicOptions(props.dicCode).value.map((item) => ({
      [props.keys?.label ?? 'label']: item.label,
      [props.keys?.value ?? 'value']: item.value,
    })) as TdOptionProps[]
  } else {
    arr = props.options
  }

  if (props.showCheckAll) {
    if (!props.multiple) {
      $notify.error('TSelect: showCheckAll is supported only for multiple select')
    } else {
      if (arr === undefined) {
        $notify.error('TSelect: options is required, when showCheckAll is true')
      } else {
        arr.unshift({
          checkAll: true,
          [props.keys?.label ?? 'label']: '全选',
        })
      }
    }
  }

  return arr
})
const modelValue = defineModel('modelValue')
const value = defineModel('value', {
  get() {
    if (finallyOptions.value !== undefined) {
      const flatOptions = finallyOptions.value.flatMap(
        (item) => (item as SelectOptionGroup).children ?? [item],
      )
      const valueKey = props.keys?.value ?? 'value'
      const isString = flatOptions.every((item: any) => typeof item[valueKey] === 'string')
      const isNumber = flatOptions.every((item: any) => typeof item[valueKey] === 'number')

      if (props.multiple) {
        if (Array.isArray(modelValue.value)) {
          if (isString) {
            return (modelValue.value as SelectValue[]).map((v) => (isFalsy(v) ? v : String(v)))
          } else if (isNumber) {
            return (modelValue.value as SelectValue[]).map((v) =>
              isFalsy(v) || Number.isNaN(Number(v)) ? v : Number(v),
            )
          }
        } else {
          $notify.error('TSelect: modelValue must be an array, when multiple is true')
        }
      } else {
        if (isString) {
          return isFalsy(modelValue.value) ? modelValue.value : String(modelValue.value)
        } else if (isNumber) {
          return isFalsy(modelValue.value) || Number.isNaN(Number(modelValue.value))
            ? modelValue.value
            : Number(modelValue.value)
        }
      }
    }

    return modelValue.value
  },
  set(v: any) {
    modelValue.value = v
  },
})
const popupVisible = defineModel('popupVisible', {
  default: false,
})
const inputValue = defineModel('inputValue', {
  default: '',
})
const bindProps = computed(() => {
  const obj: Record<string, any> = {
    ...props,
  }

  delete obj.options
  delete obj.dicCode
  delete obj.showCheckAll
  return obj
})
</script>

<template>
  <component
    :is="
      h(
        compo,
        mergeProps($attrs, bindProps, {
          options: finallyOptions,
          modelValue: value,
          'onUpdate:modelValue': (v: any) => {
            value = v
          },
          popupVisible,
          'onUpdate:popupVisible': (v: boolean) => {
            popupVisible = v
          },
          inputValue,
          'onUpdate:inputValue': (v: string) => {
            inputValue = v
          },
          ref: compoRef,
        }),
        $slots,
      )
    "
  >
  </component>
</template>
