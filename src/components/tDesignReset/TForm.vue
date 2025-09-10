<script setup lang="ts">
import type {
  CheckboxProps,
  FormInstanceFunctions,
  FormItemProps,
  FormProps,
} from 'tdesign-vue-next'
import type { AllowedComponentProps, Reactive } from 'vue'
import type { CheckboxGroupProps } from './TCheckboxGroup.vue'
import type { InputProps } from './TInput.vue'
import type { RadioGroupProps } from './TRadioGroup.vue'

export type FormItemType = MaybeRefInterface<
  {
    [K in keyof _FormItemProps as `_${K}`]: _FormItemProps[K] // formItem 的属性以下划线开头
  } & {
    show?: boolean // 是否显示
  } & XOR<ComponentItemType, SlotItemType>
>

type _FormItemProps = AllowedComponentProps &
  Omit<FormItemProps, 'labelWidth' | 'name'> & {
    required?: boolean
  }
type ComponentItemType = AllowedComponentProps &
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
  > & {
    model: string
  }
interface SlotItemType {
  model?: string
  slot: string
}

const props = withDefaults(
  defineProps<
    Omit<FormProps, 'data' | 'labelWidth'> & {
      data: {
        [key: string]: any
      }
      items: FormItemType[]
    }
  >(),
  {
    colon: true,
    labelAlign: 'top',
    layout: 'inline',
    preventSubmitDefault: true,
    requiredMark: undefined,
    resetType: 'initial',
    showErrorMessage: true,
  },
)
const formItemsConfig = computed(() => {
  return props.items.map((item) => {
    return reactive(item)
  })
})

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

  const isSelect = ['TCheckbox', 'TCheckboxGroup', 'TRadioGroup'].includes(
    item.component as string,
  )
  const message = isSelect
    ? `请选择${obj.label ?? ''}`
    : `${obj.label ?? ''}必填`

  if (obj.required === true) {
    if (obj.rules === undefined) {
      obj.rules = []
    }

    if (
      obj.rules.find((rule: any) => rule.required === true) === undefined &&
      props.rules?.[item.model ?? '']?.find(
        (rule: any) => rule.required === true,
      ) === undefined
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
      message:
        obj.rules.find((rule: any) => rule.required === true).message ??
        message,
      whitespace: true,
    })
  }

  return obj
}

const bindProps = computed(() => {
  const obj: Record<string, any> = {
    ...props,
  }

  if (obj.rules !== undefined) {
    const r: Record<string, any> = {}

    Object.keys(obj.rules).forEach((key) => {
      r[key] = []

      const rules = obj.rules[key]

      rules.forEach((rule: any) => {
        r[key].push(rule)

        if (
          rule.required === true &&
          rules.find((r: any) => r.whitespace === true) === undefined
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
  return obj
})
const compo = _Form
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  const exposed = instance ?? {}

  vm.exposed = exposed
  vm.exposeProxy = exposed
}

const formItemLabelEls = shallowRef<HTMLCollection>()

onMounted(() => {
  formItemLabelEls.value =
    vm.exposed!.$el.getElementsByClassName('t-form__label')
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

defineExpose({} as FormInstanceFunctions)
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <component
    :is="compo"
    v-bind="{
      ...bindProps,
      ...$attrs,
      ref: compoRef,
    }"
    label-width="fit-content"
  >
    <TFormItem
      v-for="item in formItemsConfig.filter((item) => item.show !== false)"
      :key="item.model ?? item.slot"
      v-bind="getFormItemProps(item)"
      :name="item.model"
      :class="{
        no_label_item: isFalsy(item._label),
        empty_label_item: item._label === ' ',
      }"
    >
      <slot
        v-if="(item as SlotItemType).slot"
        :name="(item as SlotItemType).slot"
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
