/**
 * Simplify a complex type expression into a single object.
 */

export type Simplify<T> = T extends any[] | Date
  ? T
  : { [K in keyof T]: T[K] } & {}

/**
 * Turn a union type into an intersection.
 */

export type UnionToIntersection<U> = (U extends any
? (k: U) => void
: never) extends (k: infer I) => void
  ? I
  : never
