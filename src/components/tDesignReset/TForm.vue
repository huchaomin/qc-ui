<script setup lang="ts">
/**
 * @description: form reset 时， show 为 false 的不会一起reset
 * @description: 要监听 formItem 的值变化时，可用onChange事件, 暂时没考虑 onUpdate:modelValue 事件
 */
import type {
  FormInstanceFunctions as _FormInstanceFunctions,
  FormProps as _FormProps,
  CheckboxProps,
  FormItemProps,
  ValidateResultList,
} from 'tdesign-vue-next'
import type { AllowedComponentProps, Reactive } from 'vue'
import type { CheckboxGroupProps } from './TCheckboxGroup.vue'
import type { DateRangePickerProps } from './TDateRangePicker.vue'
import type { InputProps } from './TInput.vue'
import type { RadioGroupProps } from './TRadioGroup.vue'
import type { SelectProps } from './TSelect.vue'
import type { TextareaProps } from './TTextarea.vue'
import { mergeProps } from 'vue'
import { formPropsInit } from './utils'

export type FormItemType = {
  [K in keyof _FormItemProps as `_${K}`]: _FormItemProps[K] // formItem 的属性以下划线开头
} & {
  show?: boolean // 是否显示
} & XOR<ComponentItemType, SlotItemType>

type _FormItemProps = AllowedComponentProps &
  Omit<FormItemProps, 'labelWidth' | 'name'> & {
    required?: boolean
  }
type ComponentItemType = AllowedComponentProps &
  XOR<
    XOR<
      Omit<DateRangePickerProps, 'modelValue'> & {
        component: 'TDateRangePicker'
      },
      XOR<
        XOR<
          XOR<
            XOR<
              Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'modelValue'> & {
                component: 'TCheckbox'
              },
              Omit<InputProps, 'modelValue'> & {
                component?: 'TInput'
              }
            >,
            Omit<RadioGroupProps, 'modelValue'> & {
              component: 'TRadioGroup'
            }
          >,
          Omit<CheckboxGroupProps, 'modelValue'> & {
            component: 'TCheckboxGroup'
          }
        >,
        Omit<SelectProps, 'modelValue'> & {
          component: 'TSelect'
        }
      >
    >,
    Omit<TextareaProps, 'modelValue'> & {
      component: 'TTextarea'
    }
  > & {
    model: string
  }
interface SlotItemType {
  model?: string // 传给 name 参与校验
  slot: string
}
defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<FormProps>(), formPropsInit)

export type FormProps = {
  data?: Record<string, any>
  items: FormItemType[]
  labelAlign?: 'right' | 'top'
  /**
   * @description: 是否在验证失败时显示错误信息
   */
  msgErrorWhenValidate?: boolean
} & Omit<_FormProps, 'data' | 'labelAlign' | 'labelWidth'>

const formItemsConfig = computed(() => {
  return props.items.map((item) => {
    return reactive(item)
  })
})

watch(
  formItemsConfig,
  (config) => {
    config.forEach((item) => {
      if (
        item.model !== undefined &&
        !Object.prototype.hasOwnProperty.call(props.data, item.model)
      ) {
        const isArr =
          ['TCheckboxGroup', 'TDateRangePicker'].includes(item.component as string) ||
          (item.multiple === true && item.component === 'TSelect')

        // eslint-disable-next-line vue/no-mutating-props
        props.data[item.model] = isArr ? [] : ''
      }
    })
  },
  {
    deep: 2,
    immediate: true,
  },
)

function getComponent(compo: string | undefined): Component {
  if (typeof compo === 'string') {
    return resolveComponent(compo) as Component
  }

  return resolveComponent('TInput') as Component
}

function getComponentProps(item: Reactive<FormItemType>): Record<string, any> {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (!key.startsWith('_') && !['component', 'model', 'show'].includes(key)) {
      // @ts-expect-error 类型实例化过深，且可能无限
      obj[key] = item[key as keyof Reactive<FormItemType>]
    }
  }

  return obj
}

function getFormItemProps(item: Reactive<FormItemType>): FormItemProps {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (key.startsWith('_')) {
      obj[key.slice(1)] = item[key as keyof Reactive<FormItemType>]
    }
  }

  const isSelect = ['TCheckbox', 'TCheckboxGroup', 'TRadioGroup'].includes(item.component as string)
  const message =
    typeof obj.label === 'string'
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

function compoRef(instance: any) {
  if (instance !== null) {
    const inst = instance as _FormInstanceFunctions & {
      getFormData: GetFormData
    }

    // @ts-expect-error 内部属性
    if (!inst.validate._alreadyReplace) {
      const orgValidate = inst.validate

      inst.validate = (...arg: Parameters<_FormInstanceFunctions['validate']>) => {
        return new Promise((resolve, reject) => {
          orgValidate(...arg).then((res) => {
            if (res === true) {
              resolve(props.data)
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
              resolve(props.data)
            } else {
              reject(res)
            }
          })
        })
      }

      // @ts-expect-error 内部属性
      inst.validateOnly._alreadyReplace = true
    }

    inst.getFormData = () => {
      return props.data
    }
  }

  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
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

export type FormInstance = Omit<_FormInstanceFunctions, 'validate' | 'validateOnly'> & {
  getFormData: GetFormData
  validate: (...arg: Parameters<_FormInstanceFunctions['validate']>) => Promise<FormProps['data']>
  validateOnly: (
    ...arg: Parameters<_FormInstanceFunctions['validateOnly']>
  ) => Promise<FormProps['data']>
}

type GetFormData = () => NonNullable<FormProps['data']>

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
      <slot
        v-if="(item as SlotItemType).slot"
        :name="(item as SlotItemType).slot"
        :item="item"
      ></slot>
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
.t-form {
  --td-comp-margin-xxl: var(--td-comp-margin-xl);
}

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
        height: 1px;
        padding-right: 0;
        opacity: 0;
      }
    }
  }

  .t-date-range-picker {
    width: 100%;
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
