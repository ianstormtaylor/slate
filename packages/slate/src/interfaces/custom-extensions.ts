/**
import { CustomExtensions } from 'slate';
import { ExtendedType } from 'slate';
import { Descendant } from 'slate';
import { Descendant } from 'slate';
 * The `CustomExtensions` interface extends types
 */
import { Descendant } from './node'

export interface BaseElement {
  children: Descendant[]
}

// This would be Text as per Slate's definition
export interface BaseText {
  text: string
}

export interface CustomExtensions {
  [key: string]: unknown
}

// prettier-ignore
export type ExtendedType<K extends string, B> =
  unknown extends CustomExtensions[K]
  ? B
  : B | CustomExtensions[K]
