import type { CellRenderContext } from '@/components/tDesignReset/TTable.d.ts'

export function getSplitSymbolCellValue({
  attrs,
  props,
}: {
  attrs: CellRenderContext
  props: {
    multiple?: boolean
    splitSymbol: string
  }
}) {
  let v = _get(attrs.row, attrs.col.colKey)

  if (typeof v === 'number') {
    v = String(v)
  }

  if (typeof v !== 'string') {
    return []
  }

  if (props.multiple) {
    return v.split(props.splitSymbol).filter(Boolean)
  }

  return [v]
}
