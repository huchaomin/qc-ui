import type { Ref } from 'vue'

export interface SysUserItem {
  [key: string]: any
  label: string
  value: string
}

const promiseMap = new Map<string, Promise<SysUserItem>>()

function setPromise(userIds: string[]): void {
  const p = alovaInst
    .Post<Record<string, any>[]>(
      'system/user/listByIds',
      {
        userIds,
      },
      {
        meta: {
          useLoading: false,
        },
      },
    )
    .then((res) =>
      res.map((item) => ({
        ...item,
        label: item.userName,
        value: item.userId,
      })),
    )

  userIds.forEach((id) => {
    promiseMap.set(
      id,
      p.then((res) => res.find((item) => item.value === id)!),
    )
  })
}

const idQueueArr: string[] = []

function getPromise(id: string): Promise<SysUserItem> {
  if (!idQueueArr.includes(id)) {
    idQueueArr.push(id)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      // 一个宏间隙里面的请求合并
      const notYet = idQueueArr.filter((id) => !promiseMap.has(id))

      if (notYet.length > 0) {
        setPromise(notYet)
      }

      idQueueArr.length = 0
      void promiseMap.get(id)!.then((res) => {
        resolve(res)
      })
    })
  })
}

const refMap = new Map<string, Ref<null | SysUserItem>>()

export function useClearSysUser() {
  idQueueArr.length = 0
  promiseMap.clear()
  refMap.clear()
}
export function useRefreshSysUser(id: string): void {
  promiseMap.delete(id)

  if (refMap.has(id)) {
    void getPromise(id).then((res) => {
      refMap.get(id)!.value = res
    })
  }
}
export function useSysUser(id: string): Ref<null | SysUserItem> {
  let item: Ref<null | SysUserItem>

  if (refMap.has(id)) {
    item = refMap.get(id)!
  } else {
    item = ref(null)
    refMap.set(id, item)
    void getPromise(id).then((res) => {
      item.value = res
    })
  }

  return item
}
