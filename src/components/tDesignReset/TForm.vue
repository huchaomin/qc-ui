<script setup lang="ts">
import type {
  CheckboxProps,
  FormInstanceFunctions,
  FormItemProps,
  FormProps,
} from 'tdesign-vue-next'
import type { InputProps } from './TInput.vue'
import type { RadioGroupProps } from './TRadioGroup.vue'

export type FormItemType = MaybeRefInterface<
  {
    show?: boolean // 是否显示
  } & XOR<ComponentItemType, SlotItemType>
>

type ComponentItemType = {
  [K in keyof Omit<FormItemProps, 'name'> as `_${K}`]: Omit<
    FormItemProps,
    'name'
  >[K] // formItem 的属性以下划线开头
} & XOR<
  XOR<
    Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'modelValue'> & {
      component: 'TCheckbox'
    },
    Omit<InputProps, 'defaultValue' | 'modelValue' | 'value'> & {
      component?: 'TInput'
    }
  >,
  Omit<RadioGroupProps, 'defaultValue' | 'modelValue' | 'value'> & {
    component: 'TRadioGroup'
  }
> & {
    model: string
  }
interface SlotItemType {
  slot: string
}

const props = withDefaults(
  defineProps<
    Omit<FormProps, 'data'> & {
      data: {
        [key: string]: any
      }
      items: FormItemType[]
    }
  >(),
  {
    colon: true,
    labelAlign: 'top',
    labelWidth: 'fit-content',
    preventSubmitDefault: true,
    resetType: 'initial',
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

function getComponentProps(item: ComponentItemType): Record<string, any> {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (!key.startsWith('_') && !['component', 'model', 'show'].includes(key)) {
      obj[key] = item[key as keyof ComponentItemType]
    }
  }

  return obj
}

function getFormItemProps(item: ComponentItemType): FormItemProps {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (key.startsWith('_')) {
      obj[key.slice(1)] = item[key as keyof ComponentItemType]
    }
  }

  return obj
}

const bindProps = computed(() => {
  const obj: Record<string, any> = {
    ...props,
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
  >
    <template
      v-for="item in formItemsConfig.filter((item) => item.show !== false)"
      :key="(item as ComponentItemType).model ?? (item as SlotItemType).slot"
    >
      <slot
        v-if="(item as SlotItemType).slot"
        :name="(item as SlotItemType).slot"
      ></slot>
      <TFormItem
        v-else
        v-bind="getFormItemProps(item as ComponentItemType)"
        :name="(item as ComponentItemType).model"
      >
        <component
          :is="getComponent((item as ComponentItemType).component)"
          v-model="data[(item as ComponentItemType).model]"
          v-bind="getComponentProps(item as ComponentItemType)"
        ></component>
      </TFormItem>
    </template>
  </component>
</template>
