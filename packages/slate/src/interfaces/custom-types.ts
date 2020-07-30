/**
 * Extendable Custom Types Interface
 */

export interface CustomTypes {
  [key: string]: unknown
}

export type ExtendedType<K extends string, B> = unknown extends CustomTypes[K]
  ? B & { [key: string]: unknown }
  : B & CustomTypes[K]
