/**
 * @description: @tdesign/shared-hooks useDefaultValue
 */
import type { Ref } from 'vue'
import { kebabCase } from 'lodash-es'

type ChangeHandler<T, P extends any[]> = (value: T, ...args: P) => void

export function useDefaultValue<T, P extends any[]>(
  value: Ref<T>,
  defaultValue: T,
  onChange: ChangeHandler<T, P>,
  propsName: string,
): [Ref<T>, ChangeHandler<T, P>] {
  const { emit, vnode } = getCurrentInstance()!
  // @ts-expect-error 类型错误
  const internalValue: Ref<T> = ref()
  const vProps = vnode.props ?? {}
  const isVMP = vProps[propsName] !== undefined || vProps[kebabCase(propsName)] !== undefined

  if (isVMP) {
    return [
      value,
      (newValue, ...args) => {
        emit(`update:${propsName}`, newValue)
        onChange?.(newValue, ...args)
      },
    ]
  }

  internalValue.value = defaultValue
  return [
    internalValue,
    (newValue, ...args) => {
      internalValue.value = newValue
      onChange?.(newValue, ...args)
    },
  ]
}
