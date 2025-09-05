export {}
type Without<T, U> = { [P in Exclude<keyof T, keyof U>]?: never }
declare global {
  type XOR<T, U> = T | U extends object
    ? (T & Without<U, T>) | (U & Without<T, U>)
    : T | U
}
