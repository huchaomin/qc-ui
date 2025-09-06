export interface DicItem {
  dictType: string
  label: string
  remark: string
  value: string
}

const promiseMap = new Map<string, Promise<DicItem[]>>()

function setPromise(codeArr: string[]): void {
  codeArr.forEach((code) => {
    // TODO
    promiseMap.set(
      code,
      alovaInst
        .Get<Record<string, string>[]>(
          `system/dict/data/types/${codeArr.join(',')}`,
          {
            meta: {
              useLoading: false,
            },
          },
        )
        .then(
          (res) =>
            res
              .map((item) => ({
                dictType: item.dictType,
                label: item.dictLabel,
                remark: item.remark,
                value: item.dictValue,
              }))
              .filter((item) => item.dictType === code) as DicItem[],
        ),
    )
  })
}

const codeQueueArr: string[] = []

function getPromise(code: string): Promise<DicItem[]> {
  if (!codeQueueArr.includes(code)) {
    codeQueueArr.push(code)
  }

  return new Promise((resolve) => {
    setTimeout(() => {
      // 一个宏间隙里面的请求合并
      const notYet = codeQueueArr.filter((code) => !promiseMap.has(code))

      setPromise(notYet)
      codeQueueArr.length = 0
      void promiseMap.get(code)!.then((res) => {
        resolve(res)
      })
    })
  })
}

const refMap = new Map<string, Ref<DicItem[]>>()

export function useDicOptions(code: string, includeArr?: string[]) {
  let arr: Ref<DicItem[]>

  if (refMap.has(code)) {
    arr = refMap.get(code)!
  } else {
    arr = ref([])
    refMap.set(code, arr)
    void getPromise(code).then((res) => {
      arr.value = res
    })
  }

  return computed(() =>
    arr.value.filter((item) =>
      includeArr === undefined ? true : includeArr.includes(item.value),
    ),
  )
}
