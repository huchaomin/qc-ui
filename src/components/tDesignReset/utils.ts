import type { Ref } from 'vue'

export const tablePropsInit = {
  bordered: true,
  disableDataPage: true,
  disableSpaceInactiveRow: true,
  flexHeight: false,
  hover: true,
  lazyLoad: true, // 开启整个表格的懒加载
  maxHeight: 507,
  resizable: true,
  rowSelectionAllowUncheck: false, // 行选中单选场景，是否允许取消选中
  scroll: () => ({
    isFixedRowHeight: true,
    rowHeight: 45,
    threshold: 500,
    type: 'virtual' as const,
  }),
  selectOnRowClick: true,
  showHeader: true,
  showToggleFullscreenBtn: false,
  stripe: true,
  tableLayout: 'fixed',
  tree: () => ({}), // 解决表格报错问题
} as const

export const linkPropsInit = {
  theme: 'primary',
} as const

export const buttonPropsInit = {} as const

export const formPropsInit = {
  colon: true,
  labelAlign: 'top',
  layout: 'inline',
  msgErrorWhenValidate: true,
  preventSubmitDefault: true,
  requiredMark: undefined,
  resetType: 'initial',
  showErrorMessage: true,
} as const

type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void

/**
 * @description: @tdesign/shared-hooks useDefaultValue
 */

export function useDefaultValue<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  propsName: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit, vnode } = getCurrentInstance()!
  const vProps = vnode.props ?? {}
  const isVMP =
    Object.prototype.hasOwnProperty.call(vProps, propsName) ||
    Object.prototype.hasOwnProperty.call(vProps, _.kebabCase(propsName))

  if (isVMP) {
    return [
      value,
      (newValue, ...args) => {
        emit(`update:${propsName}`, newValue)
        onChange?.(newValue, ...args)
      },
    ]
  }

  const internalValue = ref(defaultValue)

  return [
    internalValue as Ref<T>,
    (newValue, ...args) => {
      internalValue.value = newValue
      onChange?.(newValue, ...args)
    },
  ]
}
