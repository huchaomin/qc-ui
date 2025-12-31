/**
 * @description: @tdesign/shared-hooks useDefaultValue
 */
import type { Ref } from 'vue'

type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void

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
