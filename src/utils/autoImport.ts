import type { FormItem } from '@/components/tDesignReset/TForm.vue'

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

function pickFormItems(
  items: FormItem[],
  modelKeys: string[],
  mergeConfig: Record<string, Partial<ExcludeFunction<FormItem>> & { model?: never }> = {},
): FormItem[] {
  const arr: FormItem[] = []
  const mergeConfigKeys = Object.keys(mergeConfig)

  modelKeys.forEach((key) => {
    // eslint-disable-next-line ts/no-unsafe-assignment, ts/no-unsafe-member-access
    const item = items.find((item) => (item as ExcludeFunction<FormItem>).model === key)

    if (item === undefined) {
      void $notify.error(`${key} pickFormItems 失败`)
    } else {
      const mergeConfigCurrentKeyIndex = mergeConfigKeys.indexOf(key)

      if (mergeConfigCurrentKeyIndex !== -1) {
        mergeConfigKeys.splice(mergeConfigCurrentKeyIndex, 1)
      }

      arr.push({
        ...item,
        ...(mergeConfig[key] ?? {}),
      } as FormItem)
    }
  })

  if (mergeConfigKeys.length > 0) {
    void $notify.error(`mergeConfig 以下${mergeConfigKeys.join(',')} 配置没有用到`)
  }

  return arr
}

export { isFalsy, pickFormItems }
