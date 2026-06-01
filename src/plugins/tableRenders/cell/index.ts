import type { SlotReturnValue } from 'tdesign-vue-next'
import type { AvatarProps } from './Avatar.vue'
import type { ButtonsProps } from './Buttons.vue'
import type { DefaultProps } from './Default.vue'
import type { DicLabelProps } from './DicLabel.vue'
import type { FormatDateProps } from './FormatDate.vue'
import type { FormatNumberProps } from './FormatNumber.vue'
import type { IconProps } from './Icon.vue'
import type { ImageProps } from './Image.vue'
import type { ImageViewerProps } from './ImageViewer.vue'
import type { InputProps } from './Input.vue'
import type { InputNumberProps } from './InputNumber.vue'
import type { LinkProps } from './Link.vue'
import type { OptionLabelProps } from './OptionLabel.vue'
import type { SelectProps } from './Select.vue'
import type { SwitchProps } from './Switch.vue'
import type { TagsProps } from './Tags.vue'
import type { TypographyTextProps } from './TypographyText.vue'
import type { TypographyTextLinkProps } from './TypographyTextLink.vue'
import type { CellRenderContext, TableCol, TNodeFn } from '@/components/tDesignReset/TTable.d.ts'
import Wrapper from '../Wrapper.vue'

export type CellComponentConfig = {
  [K in keyof ComponentPropsMap]: ComponentConfig<K>
}[keyof ComponentPropsMap]
export type CellConfigFn = (
  h: typeof import('vue').h,
  context: CellRenderContext,
) => CellComponentConfig | SlotReturnValue
export type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] & {
  _component: T
}

interface ComponentPropsMap {
  Avatar: AvatarProps
  Buttons: ButtonsProps
  Default: DefaultProps
  DicLabel: DicLabelProps
  FormatDate: FormatDateProps
  FormatNumber: FormatNumberProps
  Icon: IconProps
  Image: ImageProps
  ImageViewer: ImageViewerProps
  Input: InputProps
  InputNumber: InputNumberProps
  Link: LinkProps
  OptionLabel: OptionLabelProps
  Select: SelectProps
  Switch: SwitchProps
  Tags: TagsProps
  TypographyText: TypographyTextProps
  TypographyTextLink: TypographyTextLinkProps
}

const compos: Record<string, Component> = import.meta.glob('./*.vue', {
  eager: true,
  import: 'default',
})

export function getCellRender(_config: TableCol['cell']): TNodeFn {
  if (typeof _config === 'string') {
    void $notify.error('cell 值类型为 string 表示使用插槽渲染, 没有计算宽度, 所以暂不支持')
    return () => null
  }

  const config = _config === undefined ? { _component: 'Default' as const } : _config

  if (isCellObjConfig(config)) {
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
    const result = config(h, context)

    if (isCellObjConfig(result)) {
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

function isCellObjConfig(
  value: CellComponentConfig | CellConfigFn | SlotReturnValue,
): value is CellComponentConfig {
  return typeof value === 'object' && value !== null && '_component' in value
}
