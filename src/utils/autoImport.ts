export {
  cloneDeep as _cloneDeep,
  difference as _difference,
  groupBy as _groupBy,
  kebabCase as _kebabCase,
  pick as _pick,
  uniqueId as _uniqueId,
} from 'lodash-es'

/**
 * @description: 判断是否为空值，一般用于表单填写时的判断
 */
function isFalsy(val: any): boolean {
  // 0 和 false 是合法值
  return ['', null, undefined].includes(val as null | string | undefined) || Number.isNaN(val)
}

export { isFalsy }
