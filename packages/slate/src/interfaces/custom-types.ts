import { Descendant } from './node'

export interface BaseElement {
  children: Descendant[]
}

export interface BaseText {
  text: string
}

export interface CustomTypes {
  [key: string]: unknown
}

export type ExtendedType<K extends string, B> =
  unknown extends CustomTypes[K]
  ? B
  : B & CustomTypes[K]
