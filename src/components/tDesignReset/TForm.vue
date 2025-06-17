<script setup lang="ts">
import type { CheckboxProps, FormItemProps, FormProps, InputProps } from 'tdesign-vue-next'

export type FormItemType = {
  show?: boolean // 是否显示
} & (ComponentItemType | SlotItemType)
type ComponentItemType = (
  {
    component: 'TCheckbox'
    componentProps?: Omit<CheckboxProps, 'checked' | 'defaultChecked' | 'modelValue'>
  }
  | {
    component?: 'TInput'
    componentProps?: Omit<InputProps, 'defaultValue' | 'modelValue' | 'value'>
  }
) & {
  formItemProps?: Omit<FormItemProps, 'name'>
  model: string
}
interface SlotItemType {
  slot: string
}
const props = withDefaults(
  defineProps<Omit<FormProps, 'data'> & {
    data: {
      [key: string]: any
    }
    items: FormItemType[]
  }>(),
  {
    colon: true,
    labelAlign: 'top',
    labelWidth: 'fit-content',
    preventSubmitDefault: true,
    resetType: 'initial',
  },
)

function getComponent(compo: string | undefined): Component {
  if (typeof compo === 'string') {
    return resolveComponent(compo) as Component
  }

  return resolveComponent('TInput') as Component
}

const compo = _Form
const vm = getCurrentInstance()!

function compoRef(instance: any) {
  vm.exposed = instance ?? {}
  vm.exposeProxy = instance ?? {}
}
</script>

<template>
  <!-- eslint-disable vue/no-mutating-props -->
  <component
    :is="compo"
    v-bind="{
      ...props,
      ...$attrs,
    }"
    :ref="compoRef"
  >
    <template v-for="item in items.filter(item => item.show !== false)" :key="(item as ComponentItemType).model ?? (item as SlotItemType).slot">
      <slot v-if="(item as SlotItemType).slot" :name="(item as SlotItemType).slot"></slot>
      <TFormItem v-else v-bind="(item as ComponentItemType).formItemProps ?? {}" :name="(item as ComponentItemType).model">
        <component
          :is="getComponent((item as ComponentItemType).component)"
          v-model="data[(item as ComponentItemType).model]"
          v-bind="(item as ComponentItemType).componentProps ?? {}"
        ></component>
      </TFormItem>
    </template>
  </component>
</template>
