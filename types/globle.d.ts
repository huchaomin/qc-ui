import type { MaybeRef } from 'vue'

export {} // 为了让这个声明文件变成模块声明文件，而不是一个全局声明文件

type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
declare global {
  type MaybeRefInterface<T> = {
    [K in keyof T]: MaybeRef<T[K]>
  }
  type XOR<T, U> = T | U extends object ? (T & Without<U, T>) | (U & Without<T, U>) : T | U
}
