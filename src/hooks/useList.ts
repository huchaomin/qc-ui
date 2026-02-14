export type UseListKey = keyof typeof promiseMap

interface ListItem {
  [key: string]: any
  label: string
  value: string
}

const refMap = new Map<Partial<UseListKey>, Ref<ListItem[]>>()
const loadingMap = new Map<Partial<UseListKey>, boolean>()
const promiseMap = {
  brand: alovaInst.Get<ListItem[]>('yq/brand/getList', {
    transform: (res) => {
      return (res as Record<string, any>[]).map((item) => ({
        label: item.brandName as string,
        value: item.id as string,
        ...item,
      }))
    },
  }),
}

export function useList(key: UseListKey) {
  const arr = refMap.has(key) ? refMap.get(key)! : ref([])

  if (!refMap.has(key)) {
    refMap.set(key, arr)
  }

  if (arr.value.length === 0) {
    if (!loadingMap.has(key) || loadingMap.get(key) === false) {
      loadingMap.set(key, true)
      void promiseMap[key]
        .then((res) => {
          arr.value = res
        })
        .finally(() => {
          loadingMap.set(key, false)
        })
    }
  }

  return arr
}
export function useListRefresh(key: UseListKey) {
  if (refMap.has(key)) {
    if (!loadingMap.has(key) || loadingMap.get(key) === false) {
      loadingMap.set(key, true)
      void promiseMap[key]
        .then((res) => {
          refMap.get(key)!.value = res
        })
        .finally(() => {
          loadingMap.set(key, false)
        })
    }
  }
}
