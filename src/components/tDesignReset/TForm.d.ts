import type {
  FormInstanceFunctions as _FormInstanceFunctions,
  FormProps as _FormProps,
  FormItemProps,
} from 'tdesign-vue-next'
import type { AllowedComponentProps, ComponentPublicInstance, Ref } from 'vue'
import type { CheckboxProps } from './TCheckbox.vue'
import type { CheckboxGroupProps } from './TCheckboxGroup.vue'
import type { DatePickerProps } from './TDatePicker.vue'
import type { DateRangePickerProps } from './TDateRangePicker.vue'
import type { InputProps } from './TInput.vue'
import type { InputNumberProps } from './TInputNumber.vue'
import type { RadioGroupProps } from './TRadioGroup.vue'
import type { RangeInputProps } from './TRangeInput.vue'
import type { SelectProps } from './TSelect.vue'
import type { SwitchProps } from './TSwitch.vue'
import type { TagInputProps } from './TTagInput.vue'
import type { TextareaProps } from './TTextarea.vue'
import type { TreeProps } from './TTree.vue'
import type { TreeSelectProps } from './TTreeSelect.vue'
import type { UploadProps } from './TUpload.vue'
import type { CronProps } from '@/components/autoImport/Cron/Index.vue'

export type FormExposed = (ComponentPublicInstance & FormInstance) | null
export interface FormInstance extends Omit<_FormInstanceFunctions, 'validate' | 'validateOnly'> {
  getFormData: GetFormData
  setFormData: SetFormData
  validate: (...arg: Parameters<_FormInstanceFunctions['validate']>) => Promise<FormPropsData>
  validateOnly: (
    ...arg: Parameters<_FormInstanceFunctions['validateOnly']>
  ) => Promise<FormPropsData>
}
export type FormItem = XOR<
  ItemWithoutOthers,
  XOR<
    AllowedComponentProps &
      ComponentItemXOR &
      FormItemComponentPropsUnderlyingWithMeta & {
        __others?: (
          formData: FormPropsData,
          exposed: Ref<FormExposed>,
        ) => Partial<
          AllowedComponentProps & ComponentItemXOR & FormItemComponentPropsUnderlyingWithMeta
        >
        model: string
      },
    FormItemComponentPropsUnderlyingWithMeta & {
      __others?: (
        formData: FormPropsData,
        exposed: Ref<FormExposed>,
      ) => Partial<
        FormItemComponentPropsUnderlyingWithMeta & {
          model?: string
        }
      >
      slot: string
    } & {
      model?: string
    }
  >
>
export interface FormProps extends Omit<_FormProps, 'data' | 'labelAlign' | 'labelWidth'> {
  /**
   * @description: 是否自动计算 label 宽度，默认 true
   */
  autoLabelWidth?: boolean
  data?: FormPropsData
  items: FormItem[]
  labelAlign?: 'right' | 'top'
  /**
   * @description: 是否在验证失败时显示错误信息
   */
  msgErrorWhenValidate?: boolean
}

type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] &
  (T extends 'TInput' ? { component?: T } : { component: T })
type ComponentItemXOR = UnionToNestedXOR<
  {
    [K in keyof ComponentPropsMap]: ComponentConfig<K>
  }[keyof ComponentPropsMap]
>
type ComponentOrSlot = XOR<
  AllowedComponentProps &
    ComponentItemXOR & {
      model: string
    },
  SlotItem
>
interface ComponentPropsMap {
  Cron: Omit<CronProps, 'modelValue'>
  TCheckbox: Omit<CheckboxProps, 'modelValue'>
  TCheckboxGroup: Omit<CheckboxGroupProps, 'modelValue'>
  TDatePicker: Omit<DatePickerProps, 'modelValue'>
  TDateRangePicker: Omit<DateRangePickerProps, 'modelValue'>
  TInput: Omit<InputProps, 'modelValue'>
  TInputNumber: Omit<InputNumberProps, 'modelValue'>
  TRadioGroup: Omit<RadioGroupProps, 'modelValue'>
  TRangeInput: Omit<RangeInputProps, 'modelValue'>
  TSelect: Omit<SelectProps, 'modelValue'>
  TSwitch: Omit<SwitchProps, 'modelValue'>
  TTagInput: Omit<TagInputProps, 'modelValue'>
  TTextarea: Omit<TextareaProps, 'modelValue'>
  TTree: Omit<TreeProps, 'modelValue'>
  TTreeSelect: Omit<TreeSelectProps, 'modelValue'>
  TUpload: Omit<UploadProps, 'modelValue'>
}
interface FormItemComponentProps
  extends AllowedComponentProps, Omit<FormItemProps, 'labelWidth' | 'name'> {
  required?: boolean
}
type FormItemComponentPropsUnderlying = {
  [K in keyof FormItemComponentProps as `_${K}`]: FormItemComponentProps[K]
}
interface FormItemComponentPropsUnderlyingWithMeta extends FormItemComponentPropsUnderlying {
  /**
   * @description: 是否显示
   */
  show?: boolean
}
type FormPropsData = Record<string, any>
type GetFormData = () => FormPropsData
type ItemWithoutOthers = ComponentOrSlot & FormItemComponentPropsUnderlyingWithMeta
type SetFormData = (
  data: FormPropsData,
  options?: {
    /**
     * @description: 需要忽略的key
     */
    ignoreKeys?: string[]
    /**
     * @description: 是否只回填非空值
     */
    isNotFalsy?: boolean
    /**
     * @description: 需要将数字转换成字符串的key
     */
    numberToStringKeys?: string[]
    /**
     * @description: 覆盖部分数据
     */
    override?: FormPropsData
    /**
     * @description: 需要逗号分割成数组赋值的key
     */
    splitToArrKeys?: string[]
  },
) => void
interface SlotItem {
  model?: string // 传给 name 参与校验
  slot: string
}
