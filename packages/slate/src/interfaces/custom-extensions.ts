/**
 * The `CustomExtensions` interface extends types
 */

export interface CustomExtensions {
  [key: string]: unknown
}

// prettier-ignore
export type ExtendedType<K extends string, B> =
  unknown extends CustomExtensions[K]
  ? B
  : B & CustomExtensions[K]
