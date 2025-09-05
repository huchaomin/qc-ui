export interface DicItem {
  label: string
  remark: string
  value: string
}

const promiseMap = new Map<string, Promise<DicItem[]>>()
