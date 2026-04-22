<script lang="ts">
/**
 * @description: form 自带 reset 时， show 为 false 的不会一起reset
 * @description: 要监听 formItem 的值变化时，可用onChange事件, 暂时没考虑 onUpdate:modelValue 事件
 */
import type {
  FormInstanceFunctions as _FormInstanceFunctions,
  FormItemProps,
  ValidateResultList,
} from 'tdesign-vue-next'
import type {
  FormProps,
  FormPropsData,
  GetFormData,
  ItemWithoutOthers,
  SetFormData,
  SlotItem,
} from './TForm.d.ts'
import { mergeProps } from 'vue'
import busFormItems from '@/bus/busFormItems.ts'
import TCheckbox from './TCheckbox.vue'
import TCheckboxGroup from './TCheckboxGroup.vue'
import TDatePicker from './TDatePicker.vue'
import TDateRangePicker from './TDateRangePicker.vue'
import TInput from './TInput.vue'
import TInputNumber from './TInputNumber.vue'
import TRadioGroup from './TRadioGroup.vue'
import TRangeInput from './TRangeInput.vue'
import TSelect from './TSelect.vue'
import TSwitch from './TSwitch.vue'
import TTagInput from './TTagInput.vue'
import TTextarea from './TTextarea.vue'
import TTree from './TTree.vue'
import TTreeSelect from './TTreeSelect.vue'
import TUpload from './TUpload.vue'

export const formPropsInit = {
  autoLabelWidth: true,
  colon: true,
  data: () => reactive({}),
  labelAlign: 'top',
  layout: 'inline',
  msgErrorWhenValidate: true,
  preventSubmitDefault: true,
  requiredMark: undefined,
  resetType: 'initial',
  showErrorMessage: true,
} as const
export default {
  inheritAttrs: false,
}
</script>

<script setup lang="ts">
const props = withDefaults(defineProps<FormProps>(), formPropsInit)
const vm = getCurrentInstance()!
const formExposed = ref<FormExposed>(null)
const formItemsConfig = computed(() => {
  return props.items.map((item) => {
    if (typeof item.__others === 'function') {
      const obj = {
        ...item,
        ...item.__others(props.data, formExposed),
      }

      delete obj.__others
      return obj as ItemWithoutOthers
    }

    return item
  })
})

function setInitFormDataValues() {
  formItemsConfig.value.forEach((item) => {
    if (item.model !== undefined && !Object.hasOwn(props.data, item.model)) {
      const isArr =
        ['TCheckboxGroup', 'TDateRangePicker', 'TRangeInput', 'TTagInput', 'TUpload'].includes(
          item.component as string,
        ) ||
        (item.multiple === true && item.component === 'TSelect') ||
        (item.multiple === true && item.component === 'TDatePicker')

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

const asyncComponentCache = new Map<string, Component>()
const componentMapInReset = {
  TCheckbox,
  TCheckboxGroup,
  TDatePicker,
  TDateRangePicker,
  TInput,
  TInputNumber,
  TRadioGroup,
  TRangeInput,
  TSelect,
  TSwitch,
  TTagInput,
  TTextarea,
  TTree,
  TTreeSelect,
  TUpload,
}

function getComponent(compo: string | undefined): Component {
  if (typeof compo === 'string') {
    if (busFormItems.has(compo)) {
      if (!asyncComponentCache.has(compo)) {
        asyncComponentCache.set(compo, defineAsyncComponent(busFormItems.get(compo)!))
      }

      return asyncComponentCache.get(compo)!
    }

    return componentMapInReset[compo as keyof typeof componentMapInReset]
  }

  return TInput
}

function getComponentProps(item: ItemWithoutOthers): Record<string, any> {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (!key.startsWith('_') && !['component', 'model', 'show'].includes(key)) {
      obj[key] = item[key as keyof ItemWithoutOthers]
    }
  }

  return obj
}

function getFormItemProps(item: ItemWithoutOthers): FormItemProps {
  const obj: Record<string, any> = {}

  for (const key in item) {
    if (key.startsWith('_')) {
      obj[key.slice(1)] = item[key as keyof ItemWithoutOthers]
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
      !obj.rules.some((rule: any) => rule.required === true) &&
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
    !obj.rules.some((rule: any) => rule.whitespace === true)
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

        if (rule.required === true && !rules!.some((r: any) => r.whitespace === true)) {
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
  delete obj.autoLabelWidth
  Object.keys(obj).forEach((key) => {
    if (obj[key as keyof typeof obj] === undefined) {
      delete obj[key as keyof typeof obj]
    }
  })
  return obj
})
const compo = _Form
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

    // @ts-expect-error 内部属性
    if (!inst.clearValidate._alreadyReplace) {
      const orgClearValidate = inst.clearValidate

      inst.clearValidate = (...arg: Parameters<_FormInstanceFunctions['clearValidate']>) => {
        // 有好的方法吗？
        nextTick(() => {
          nextTick(() => {
            nextTick(() => {
              nextTick(() => {
                nextTick(() => {
                  orgClearValidate(...arg)
                })
              })
            })
          })
        })
      }

      // @ts-expect-error 内部属性
      inst.clearValidate._alreadyReplace = true
    }

    inst.getFormData = getFormData

    inst.setFormData = (data, options) => {
      const {
        ignoreKeys = [],
        isNotFalsy = true,
        numberToStringKeys = [],
        override = {},
        splitToArrKeys = [],
      } = options ?? {}

      Object.keys(props.data).forEach((key) => {
        if (ignoreKeys.includes(key)) {
          return
        }

        if (splitToArrKeys.includes(key)) {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[key] =
            typeof data[key] === 'string' ? data[key].split(',').filter(Boolean) : []
        } else if (isNotFalsy) {
          if (!isFalsy(data[key])) {
            // eslint-disable-next-line vue/no-mutating-props
            props.data[key] = data[key]
          }
        } else {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[key] = data[key]
        }

        if (numberToStringKeys.includes(key) && typeof props.data[key] === 'number') {
          // eslint-disable-next-line vue/no-mutating-props
          props.data[key] = String(props.data[key])
        }
      })
      // eslint-disable-next-line vue/no-mutating-props
      Object.assign(props.data, override)
    }
  }

  const exposed = instance ?? {}

  formExposed.value = exposed
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

  if (props.labelAlign === 'top' || !props.autoLabelWidth) {
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
provide('formExposed', formExposed)
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

    .t-input-adornment {
      @apply flex-auto;
    }
  }

  .t-date-picker,
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

  &.no_item_mb {
    .t-form__item {
      margin-bottom: 0 !important;
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
