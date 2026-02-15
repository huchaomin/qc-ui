export {
  cloneDeep as _cloneDeep,
  difference as _difference,
  get as _get,
  groupBy as _groupBy,
  isPlainObject as _isPlainObject,
  kebabCase as _kebabCase,
  pick as _pick,
  set as _set,
  uniqueId as _uniqueId,
} from 'lodash-es'

type FormatNumberConfig = ConstructorParameters<typeof Intl.NumberFormat>[1] & {
  roundingMode?:
    | 'ceil'
    | 'expand'
    | 'floor'
    | 'halfCeil'
    | 'halfEven'
    | 'halfExpand'
    | 'halfFloor'
    | 'halfTrunc'
    | 'trunc'

  trailingZeroDisplay: 'auto' | 'stripIfInteger'
}

function formatNumber(n: any, config?: FormatNumberConfig): string {
  const number = Number(n)

  if (Number.isFinite(number) === false) {
    return ''
  }

  const obj: ConstructorParameters<typeof Intl.NumberFormat>[1] = {
    currency: 'CNY', // 用于货币格式化的货币, 果 style 是 "currency"，则必须提供 currency 属性
    currencyDisplay: 'symbol', // 货币符号的显示方式
    localeMatcher: 'lookup', // 确保要么匹配 zh-CN，要么失败
    maximumFractionDigits: 2, // 要使用的最大小数位数
    minimumFractionDigits: 0, // 要使用的最小小数位数
    notation: 'standard', // 如果值为 compact 的话，展示千、万等等
    numberingSystem: 'latn', // locale 为 zh-CN 时，默认为 latn https://mdn.org.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/supportedValuesOf#supported_numbering_system_types
    style: 'decimal', // decimal 为纯数字格式化， currency 为货币格式化, percent 为百分比格式化, unit 为单位格式化
    trailingZeroDisplay: 'stripIfInteger', // 如果所有小数位都为零，则删除小数位。如果任何小数位不为零 则 根据minimumFractionDigits和minimumSignificantDigits保留后缀零
    useGrouping: true, // 是否使用分组分隔符
    ...(config ?? {}),
  }

  try {
    // https://mdn.org.cn/en-US/docs/Web/JavaScript/Reference/Global_Objects/Intl/NumberFormat
    const formatter = new Intl.NumberFormat('zh-CN', obj)

    return formatter.format(number)
  } catch (e: any) {
    // eslint-disable-next-line ts/no-unsafe-argument, ts/no-unsafe-member-access
    void $notify.error(e?.message ?? '格式化数字失败')
    return String(number)
  }
}

/**
 * @description: 判断是否为空值，一般用于表单填写时的判断
 */
function isFalsy(val: any): boolean {
  // 0 和 false 是合法值
  return ['', null, undefined].includes(val as null | string | undefined) || Number.isNaN(val)
}

export { formatNumber, isFalsy }
