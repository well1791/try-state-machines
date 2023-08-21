export type NonEmptyArray<T> = [T, ...T[]]

export type Buffer = NonEmptyArray<string>

export const isNonEmptyArray = <T>(a: T[]): a is NonEmptyArray<T> => a.length > 0

export const cleanArray = (a: Array<string>): Buffer => isNonEmptyArray(a) ? a : ['']

export const concatArr = (...args: Array<Array<string>>): Buffer => {
  const [a, ...rest] = args
  return cleanArray(a.concat(...rest))
}

export const splitStrAt = (i: number, xs: string): [string, string] =>
  [xs.slice(0, i), xs.slice(i)]
