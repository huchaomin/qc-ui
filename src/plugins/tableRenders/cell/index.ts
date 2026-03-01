import type { ButtonsProps } from './Buttons.vue'
import type { DicLabelProps } from './DicLabel.vue'
import type { FormatDateProps } from './FormatDate.vue'
import type { IconProps } from './Icon.vue'
import type { LinkProps } from './Link.vue'
import type { OptionLabelProps } from './OptionLabel.vue'
import type { SwitchProps } from './Switch.vue'
import type { TypographyTextProps } from './TypographyText.vue'
import type { TypographyTextLinkProps } from './TypographyTextLink.vue'
import type {
  CellRenderContext,
  CellRenderFn,
  TableCol,
} from '@/components/tDesignReset/TTable.vue'

export type CellObjConfig = UnionToNestedXOR<
  keyof ComponentPropsMap extends infer T
    ? T extends keyof ComponentPropsMap
      ? ComponentConfig<T>
      : never
    : never
>
export type CellObjConfigFn = (
  h: typeof import('vue').h,
  context: CellRenderContext,
) => CellObjConfig

type ComponentConfig<T extends keyof ComponentPropsMap> = ComponentPropsMap[T] & {
  _component: T
}
interface ComponentPropsMap {
  Buttons: ButtonsProps
  DicLabel: DicLabelProps
  FormatDate: FormatDateProps
  Icon: IconProps
  Link: LinkProps
  OptionLabel: OptionLabelProps
  Switch: SwitchProps
  TypographyText: TypographyTextProps
  TypographyTextLink: TypographyTextLinkProps
}

const compos: Record<string, Component> = import.meta.glob('./*.vue', {
  eager: true,
  import: 'default',
})

export function getCellRender(config: TableCol['cell']): CellRenderFn | undefined {
  if (config === undefined) {
    return undefined
  }

  if (isCellObjConfig(config)) {
    // eslint-disable-next-line ts/no-unsafe-assignment
    const { _component, ...restConfig } = config

    return (h: typeof import('vue').h, context: Parameters<CellRenderFn>[1]) => {
      return h(compos[`./${_component}.vue`]!, {
        ...restConfig,
        ...context,
      })
    }
  }

  return (h: typeof import('vue').h, context: Parameters<CellRenderFn>[1]) => {
    // eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-call
    const result = config(h, context)

    if (isCellObjConfig(result)) {
      // eslint-disable-next-line ts/no-unsafe-assignment
      const { _component, ...restConfig } = result

      return h(compos[`./${_component}.vue`]!, {
        ...restConfig,
        ...context,
      })
    } else {
      return result
    }
  }
}

function isCellObjConfig(value: any): value is CellObjConfig {
  // eslint-disable-next-line ts/no-unsafe-member-access
  return value?._component !== undefined
}
