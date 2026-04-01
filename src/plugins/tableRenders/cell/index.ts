import type { SlotReturnValue } from 'tdesign-vue-next'
import type { AvatarProps } from './Avatar.vue'
import type { ButtonsProps } from './Buttons.vue'
import type { DefaultProps } from './Default.vue'
import type { DicLabelProps } from './DicLabel.vue'
import type { FormatDateProps } from './FormatDate.vue'
import type { IconProps } from './Icon.vue'
import type { ImageProps } from './Image.vue'
import type { ImageViewerProps } from './ImageViewer.vue'
import type { InputProps } from './Input.vue'
import type { InputNumberProps } from './InputNumber.vue'
import type { LinkProps } from './Link.vue'
import type { OptionLabelProps } from './OptionLabel.vue'
import type { SelectProps } from './Select.vue'
import type { SwitchProps } from './Switch.vue'
import type { TypographyTextProps } from './TypographyText.vue'
import type { TypographyTextLinkProps } from './TypographyTextLink.vue'
import type { CellRenderContext, TableCol, TNodeFn } from '@/components/tDesignReset/TTable.vue'
import Wrapper from '../Wrapper.vue'

export type CellConfigFn = (
  h: typeof import('vue').h,
  context: CellRenderContext,
) => CellConfigObj | SlotReturnValue
export type CellConfigObj = UnionToNestedXOR<
  keyof ComponentPropsMap extends infer T
    ? T extends keyof ComponentPropsMap
      ? ComponentConfig<T>
      : never
    : never
>

type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] & {
  _component: T
}
interface ComponentPropsMap {
  Avatar: AvatarProps
  Buttons: ButtonsProps
  Default: DefaultProps
  DicLabel: DicLabelProps
  FormatDate: FormatDateProps
  Icon: IconProps
  Image: ImageProps
  ImageViewer: ImageViewerProps
  Input: InputProps
  InputNumber: InputNumberProps
  Link: LinkProps
  OptionLabel: OptionLabelProps
  Select: SelectProps
  Switch: SwitchProps
  TypographyText: TypographyTextProps
  TypographyTextLink: TypographyTextLinkProps
}

const compos: Record<string, Component> = import.meta.glob('./*.vue', {
  eager: true,
  import: 'default',
})

export function getCellRender(_config: TableCol['cell']): TNodeFn {
  // 值类型为 string 表示使用插槽渲染
  // todo 插槽渲染需要处理,没有计算宽度
  // if (typeof _config === 'string') {
  //   return _config
  // }

  // eslint-disable-next-line ts/no-unsafe-assignment
  const config = _config === undefined ? { _component: 'Default' } : _config

  if (isCellObjConfig(config)) {
    // eslint-disable-next-line ts/no-unsafe-assignment
    const { _component, ...restConfig } = config

    return (h: typeof import('vue').h, context: Parameters<TNodeFn>[1]) => {
      return h(Wrapper, context, () => {
        return h(compos[`./${_component}.vue`], {
          ...restConfig,
          ...context,
        })
      })
    }
  }

  return (h: typeof import('vue').h, context: Parameters<TNodeFn>[1]) => {
    // @ts-expect-error 类型断言不准确
    // eslint-disable-next-line ts/no-unsafe-assignment
    const result = config(h, context)

    if (isCellObjConfig(result)) {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const { _component, ...restConfig } = result

      return h(Wrapper, context, () => {
        return h(compos[`./${_component}.vue`], {
          ...restConfig,
          ...context,
        })
      })
    } else {
      return h(Wrapper, context, () => result)
    }
  }
}

function isCellObjConfig(value: any): value is CellConfigObj {
  // eslint-disable-next-line ts/no-unsafe-member-access
  return value?._component !== undefined
}
