export {} // 为了让这个声明文件变成模块声明文件，而不是一个全局声明文件

/**
 * @description: 联合类型转交叉类型
 */
// type UnionToIntersection<U> = (U extends any ? (k: U) => void : never) extends (
//   k: infer I,
// ) => void
//   ? I
//   : never

/**
 * @description: 元组转嵌套的 XOR 类型
 */
type TupleToNestedXOR<T> = T extends [infer First, ...infer Rest]
  ? Rest extends []
    ? First
    : XOR<First, TupleToNestedXOR<Rest>>
  : never
/**
 * @description: 返回联合类型中的一个类型
 */
type UnionOne<T> = UnionToFnReturnIntersection<T> extends () => infer R ? R : never
/**
 * @description: 联合类型转函数返回值交叉类型
 */
type UnionToFnReturnIntersection<T> = (T extends any ? (fn: () => T) => void : never) extends (
  k: infer R,
) => void
  ? R
  : never
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
declare const RefSymbol: unique symbol
declare global {
  // https://github.com/Tencent/tdesign-vue-next/issues/6476 啥时候解决了这个issue，这里就可以删除了
  export interface Ref<T = any, S = T> {
    /**
     * Type differentiator only.
     * We need this to be in public d.ts but don't want it to show up in IDE
     * autocomplete, so we use a private Symbol instead.
     */
    [RefSymbol]: true
    get value(): T
    set value(_: S)
  }

  type ExcludeFunction<T> = T extends (...args: any[]) => any ? never : T
  type NoExtraProperties<T, U> = T extends U ? (keyof T extends keyof U ? T : never) : never
  /**
   * @description: 联合类型转嵌套的 XOR 类型
   */
  type UnionToNestedXOR<T> = TupleToNestedXOR<UnionToTuple<T>>
  /**
   * @description: 联合类型转元组
   */
  type UnionToTuple<T, R extends any[] = [], L = UnionOne<T>> = [T] extends [never]
    ? R
    : UnionToTuple<Exclude<T, L>, [...R, L]>
  type XOR<T, U> = T | U extends object ? (T & Without<U, T>) | (U & Without<T, U>) : T | U
}
