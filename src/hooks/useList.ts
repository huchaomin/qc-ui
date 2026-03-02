import { flatArrToTree } from '@/utils'

export type UseListAllKey = keyof typeof promiseMap
export type UseListKey = Exclude<UseListAllKey, UseListTreeKey>
export type UseListTreeKey = TreeKeys<typeof promiseMap>

interface ListItem {
  [key: string]: any
  label: string
  value: string
}
type TreeKeys<T> = {
  [K in keyof T]: K extends `${string}Tree` ? K : never
}[keyof T]
interface TreeListItem {
  [key: string]: any
  children?: TreeListItem[]
  label: string
  value: string
}

const refMap = new Map<Partial<UseListAllKey>, Ref<ListItem[]>>()
const loadingMap = new Map<Partial<UseListAllKey>, boolean>()
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
  monitorPhrase: alovaInst.Get<ListItem[]>('yq/monitorPhrase/getList', {
    transform: (res) => {
      return (res as Record<string, any>[]).map((item) => ({
        label: item.name as string,
        value: item.id as string,
        ...item,
      }))
    },
  }),
  systemDeptTree: alovaInst.Get<TreeListItem[]>('system/dept/list', {
    transform: (res) => {
      return flatArrToTree(
        (res as Record<string, any>[]).map((item) => {
          return {
            ...item,
            label: item.deptName as string,
            value: item.deptId as string,
          }
        }),
        {
          idKey: 'value',
        },
      ) as TreeListItem[]
    },
  }),
  systemMenuTree: alovaInst.Get<TreeListItem[]>('system/menu/list', {
    transform: (res) => {
      return flatArrToTree(
        (res as Record<string, any>[]).map((item) => {
          return {
            ...item,
            label: item.menuName as string,
            value: item.menuId as string,
          }
        }),
        {
          idKey: 'value',
        },
      ) as TreeListItem[]
    },
  }),
  systemUserDeptTree: alovaInst.Get<TreeListItem[]>('system/user/deptTree', {
    transform: (res) => {
      const fn = (item: Record<string, any>[]): TreeListItem[] => {
        return item.map((i) => {
          const obj: TreeListItem = {
            ...i,
            label: i.label as string,
            value: i.id as string,
          }

          if (Array.isArray(i.children)) {
            obj.children = fn(i.children as Record<string, any>[])
          }

          return obj
        })
      }

      return fn(res as Record<string, any>[])
    },
  }),
  task: alovaInst.Get<ListItem[]>('yq/task/getList', {
    transform: (res) => {
      return (res as Record<string, any>[]).map((item) => ({
        label: item.name as string,
        value: item.id as string,
        ...item,
      }))
    },
  }),
}

export function useList(key: UseListAllKey) {
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
export function useListRefresh(key: UseListAllKey) {
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
