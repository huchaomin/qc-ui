<script lang="ts">
/**
 * @description: form reset 时， show 为 false 的不会一起reset
 * @description: 要监听 formItem 的值变化时，可用onChange事件, 暂时没考虑 onUpdate:modelValue 事件
 */
import type {
  FormInstanceFunctions as _FormInstanceFunctions,
  FormProps as _FormProps,
  FormItemProps,
  ValidateResultList,
} from 'tdesign-vue-next'
import type { AllowedComponentProps } from 'vue'
import type { CheckboxProps } from './TCheckbox.vue'
import type { CheckboxGroupProps } from './TCheckboxGroup.vue'
import type { DateRangePickerProps } from './TDateRangePicker.vue'
import type { InputProps } from './TInput.vue'
import type { InputNumberProps } from './TInputNumber.vue'
import type { RadioGroupProps } from './TRadioGroup.vue'
import type { SelectProps } from './TSelect.vue'
import type { SwitchProps } from './TSwitch.vue'
import type { TextareaProps } from './TTextarea.vue'
import type { TreeProps } from './TTree.vue'
import type { TreeSelectProps } from './TTreeSelect.vue'
import type { UploadProps } from './TUpload.vue'
import { mergeProps } from 'vue'
import { formPropsInit } from './utils'

export interface ComponentPropsMap {
  TCheckbox: Omit<CheckboxProps, 'modelValue'>
  TCheckboxGroup: Omit<CheckboxGroupProps, 'modelValue'>
  TDateRangePicker: Omit<DateRangePickerProps, 'modelValue'>
  TInput: Omit<InputProps, 'modelValue'>
  TInputNumber: Omit<InputNumberProps, 'modelValue'>
  TRadioGroup: Omit<RadioGroupProps, 'modelValue'>
  TSelect: Omit<SelectProps, 'modelValue'>
  TSwitch: Omit<SwitchProps, 'modelValue'>
  TTextarea: Omit<TextareaProps, 'modelValue'>
  TTree: Omit<TreeProps, 'modelValue'>
  TTreeSelect: Omit<TreeSelectProps, 'modelValue'>
  TUpload: Omit<UploadProps, 'modelValue'>
}
export type FormInstance = Omit<_FormInstanceFunctions, 'validate' | 'validateOnly'> & {
  emptyFormData: EmptyFormData
  getFormData: GetFormData
  setFormData: SetFormData
  validate: (...arg: Parameters<_FormInstanceFunctions['validate']>) => Promise<FormPropsData>
  validateOnly: (
    ...arg: Parameters<_FormInstanceFunctions['validateOnly']>
  ) => Promise<FormPropsData>
}
export type FormItem = XOR<
  _FormItem,
  XOR<
    {
      __others?: (
        formData: FormPropsData,
      ) => AllowedComponentProps & ComponentItemType & FormItemBase
      model: string
    },
    {
      __others?: (formData: FormPropsData) => FormItemBase & {
        model?: string
      }
      slot: string
    }
  >
>
export type FormProps = {
  data?: FormPropsData
  items: FormItem[]
  labelAlign?: 'right' | 'top'
  /**
   * @description: 是否在验证失败时显示错误信息
   */
  msgErrorWhenValidate?: boolean
} & Omit<_FormProps, 'data' | 'labelAlign' | 'labelWidth'>

type _FormItem = FormItemBase &
  XOR<
    AllowedComponentProps &
      ComponentItemType & {
        model: string
      },
    SlotItem
  >
type _FormItemProps = AllowedComponentProps &
  Omit<FormItemProps, 'labelWidth' | 'name'> & {
    required?: boolean
  }
type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] &
  (T extends 'TInput' ? { component?: T } : { component: T })
type ComponentItemType = UnionToNestedXOR<
  keyof ComponentPropsMap extends infer T
    ? T extends keyof ComponentPropsMap
      ? ComponentConfig<T>
      : never
    : never
>
type EmptyFormData = (initData?: FormPropsData) => FormPropsData
type FormItemBase = {
  [K in keyof _FormItemProps as `_${K}`]: _FormItemProps[K] // formItem 的属性以下划线开头
} & {
  show?: boolean // 是否显示
}
type FormPropsData = Record<string, any>
type GetFormData = () => FormPropsData
type SetFormData = (
  data: FormPropsData,
  options?: {
    /**
     * @description: 是否只回填非空值
     */
    isNotFalsy?: boolean
    /**
     * @description: 覆盖部分数据
     */
    override?: FormPropsData
  },
) => void
interface SlotItem {
  model?: string // 传给 name 参与校验
  slot: string
}

export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<FormProps>(), formPropsInit)
const formItemsConfig = computed(() => {
  return props.items.map((item) => {
    if (typeof item.__others === 'function') {
      const obj = {
        ...item.__others(props.data),
        ...item,
      }

      delete obj.__others
      return obj as _FormItem
    }

    return item
  })
})

function setInitFormDataValues() {
  formItemsConfig.value.forEach((item) => {
    if (item.model !== undefined && !Object.prototype.hasOwnProperty.call(props.data, item.model)) {
      const isArr =
        ['TCheckboxGroup', 'TDateRangePicker', 'TUpload'].includes(item.component as string) ||
        (item.multiple === true && item.component === 'TSelect')

      // 这里类型有增多的话 inst.emptyFormData 也要处理一下
      // eslint-disable-next-line vue/no-mutating-props
      props.data[item.model] = isArr
        ? []
        : item.component === 'TCheckbox'
          ? false
          : item.component === 'TSwitch'
            ? Array.isArray(item.customValue)
              ? item.customValue[1]
              : false
            : ''
    }
  })
}

watch(formItemsConfig, setInitFormDataValues, {
  deep: 2,
  immediate: true,
})
watch(
  () => props.data,
  () => {
    $notify.error(`TForm: data is changed`)
  },
)

function getComponent(compo: string | undefined): Component {
  if (typeof compo === 'string') {
    return resolveComponent(compo) as Component
  }

  return resolveComponent('TInput') as Component
}

function getComponentProps(item: _FormItem): Record<string, any> {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (!key.startsWith('_') && !['component', 'model', 'show'].includes(key)) {
      obj[key] = item[key as keyof _FormItem]
    }
  }

  return obj
}

function getFormItemProps(item: _FormItem): FormItemProps {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (key.startsWith('_')) {
      obj[key.slice(1)] = item[key as keyof _FormItem]
    }
  }

  const isSelect = ['TCheckbox', 'TCheckboxGroup', 'TRadioGroup'].includes(item.component as string)
  const isUpload = item.component === 'TUpload'
  const message = isUpload
    ? '请上传文件'
    : typeof obj.label === 'string'
      ? isSelect
        ? `请选择${obj.label}`
        : `请填写${obj.label}`
      : '必填'

  if (obj.required === true) {
    if (obj.rules === undefined) {
      obj.rules = []
    }

    if (
      obj.rules.find((rule: any) => rule.required === true) === undefined &&
      props.rules?.[item.model ?? ''] === undefined
    ) {
      obj.rules.unshift(
        ...[
          {
            message,
            required: true,
          },
          {
            message,
            whitespace: true,
          },
        ],
      )
    }

    if (obj.rules.length === 0) {
      delete obj.rules
    }

    delete obj.required
  }

  if (
    obj.rules?.find((rule: any) => rule.required === true) !== undefined &&
    obj.rules.find((rule: any) => rule.whitespace === true) === undefined
  ) {
    obj.rules.unshift({
      message: obj.rules.find((rule: any) => rule.required === true).message ?? message,
      whitespace: true,
    })
  }

  return obj
}

/**
 * @description: 当两种rule都存在时, _rules 会覆盖 props.rules
 */
const otherProps = computed(() => {
  const obj: Partial<FormProps> = {
    ...props,
  }

  if (obj.rules !== undefined) {
    const r: Record<string, any> = {}

    Object.keys(obj.rules).forEach((key) => {
      r[key] = []

      const rules = obj.rules![key]

      rules!.forEach((rule: any) => {
        r[key].push(rule)

        if (
          rule.required === true &&
          rules!.find((r: any) => r.whitespace === true) === undefined
        ) {
          r[key].push({
            message: rule.message,
            whitespace: true,
          })
        }
      })
    })
    obj.rules = r
  }

  delete obj.items
  delete obj.msgErrorWhenValidate
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Form
const vm = getCurrentInstance()!
const getFormData: GetFormData = () => {
  const obj: FormPropsData = {
    ...props.data,
  }

  formItemsConfig.value.forEach((item) => {
    if (item.show === false) {
      delete obj[item.model as keyof typeof obj]
    }
  })
  return obj
}

function compoRef(instance: any) {
  if (instance !== null) {
    const inst = instance as _FormInstanceFunctions & {
      emptyFormData: EmptyFormData
      getFormData: GetFormData
      setFormData: SetFormData
    }

    // @ts-expect-error 内部属性
    if (!inst.validate._alreadyReplace) {
      const orgValidate = inst.validate

      inst.validate = (...arg: Parameters<_FormInstanceFunctions['validate']>) => {
        return new Promise((resolve, reject) => {
          orgValidate(...arg).then((res) => {
            if (res === true) {
              resolve(getFormData())
            } else {
              if (props.msgErrorWhenValidate) {
                Object.keys(res).forEach((key) => {
                  const arr = res[key as keyof typeof res] as unknown as ValidateResultList

                  arr.forEach((item: any) => {
                    if (item.result === false) {
                      $msg.error(item.message)
                    }
                  })
                })
              }

              reject(res)
            }
          })
        })
      }

      // @ts-expect-error 内部属性
      inst.validate._alreadyReplace = true
    }

    // @ts-expect-error 内部属性
    if (!inst.validate._alreadyReplace) {
      const orgValidateOnly = inst.validateOnly

      inst.validateOnly = (...arg: Parameters<_FormInstanceFunctions['validateOnly']>) => {
        return new Promise((resolve, reject) => {
          orgValidateOnly(...arg).then((res) => {
            if (res === true) {
              resolve(getFormData())
            } else {
              reject(res)
            }
          })
        })
      }

      // @ts-expect-error 内部属性
      inst.validateOnly._alreadyReplace = true
    }

    inst.getFormData = getFormData

    inst.setFormData = (data, options) => {
      const { isNotFalsy = true, override = {} } = options ?? {}

      Object.keys(props.data).forEach((key) => {
        if (isNotFalsy) {
          if (!isFalsy(data[key])) {
            // eslint-disable-next-line vue/no-mutating-props
            props.data[key] = data[key]
          }
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[key] = data[key]
        }
      })
      // eslint-disable-next-line vue/no-mutating-props
      Object.assign(props.data, override)
    }

    inst.emptyFormData = (initData) => {
      const obj: FormPropsData = {}

      Object.keys(props.data).forEach((key) => {
        if (Array.isArray(props.data[key])) {
          obj[key] = []
        } else {
          obj[key] = ''
        }
      })
      // eslint-disable-next-line vue/no-mutating-props
      return Object.assign(props.data, obj, _cloneDeep(initData ?? {}))
    }
  }

  const exposed = instance ?? {}

  vm.exposed = exposed
}

const formItemLabelEls = shallowRef<HTMLCollection>()

onMounted(() => {
  formItemLabelEls.value = vm.exposed!.$el.getElementsByClassName('t-form__label')
  calcLabelWidth()
  useMutationObserver(
    vm.exposed!.$el,
    () => {
      calcLabelWidth()
    },
    {
      attributeFilter: ['class'],
      characterData: true,
      childList: true,
      subtree: true,
    },
  )
  // 在dialog里面，需要监听窗口大小变化
  useResizeObserver(vm.exposed!.$el, () => {
    calcLabelWidth()
  })
})

function calcLabelWidth() {
  const arr = [...formItemLabelEls.value!] as HTMLElement[]

  arr.forEach((el) => {
    el.style.minWidth = 'auto'
  })

  if (props.labelAlign === 'top') {
    return
  }

  let maxWidth = 0

  arr.forEach((el) => {
    maxWidth = Math.max(maxWidth, el.offsetWidth)
  })
  arr.forEach((el) => {
    el.style.minWidth = `${maxWidth}px`
  })
}

provide('formData', props.data)
defineExpose({} as FormInstance)
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <component
    :is="compo"
    v-bind="
      mergeProps($attrs, {
        ...otherProps,
        ref: compoRef,
      })
    "
    label-width="fit-content"
  >
    <TFormItem
      v-for="item in formItemsConfig.filter((item) => item.show !== false)"
      :key="item.model ?? item.slot"
      v-bind="
        mergeProps(
          {
            ...getFormItemProps(item),
          },
          {
            class: {
              no_label_item: isFalsy(item._label),
            },
          },
        )
      "
      :name="item.model"
    >
      <slot v-if="(item as SlotItem).slot" :name="(item as SlotItem).slot"></slot>
      <component
        :is="getComponent(item.component)"
        v-else
        v-model="data[item.model as string]"
        v-bind="getComponentProps(item)"
      ></component>
    </TFormItem>
  </component>
</template>

<style scoped>
:deep() {
  .t-form__label {
    padding-right: var(--td-size-1);
  }

  .t-form__label--top {
    min-height: auto;
    line-height: inherit;
  }

  .t-form__item {
    margin-bottom: var(--td-comp-margin-xxl) !important;

    &.no_label_item {
      .t-form__label {
        display: none;
      }
    }
  }

  .t-date-range-picker {
    width: 100%;
  }
}

.t-form {
  --td-comp-margin-xxl: var(--td-comp-margin-xl);

  &:has(.t-form__item:not(.no_label_item)) {
    :deep() {
      .no_label_item {
        .t-form__label {
          display: block;
          height: 1px;
          padding-right: 0;
          opacity: 0;
        }
      }
    }
  }
}

.t-form-inline {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 0 24px;

  :deep() {
    .no_label_item {
      align-self: flex-end;
    }

    .t-form__item {
      display: block;
      min-width: auto;
      margin-right: 0;
    }
  }
}
</style>
