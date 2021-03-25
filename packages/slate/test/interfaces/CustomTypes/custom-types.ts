// import { Descendant, Element, Text, CustomTypes, BaseText } from 'slate'

// export type HeadingElement = {
//   type: 'heading'
//   level: number
//   children: Descendant[]
// }

// export type ListItemElement = {
//   type: 'list-item'
//   depth: number
//   children: Descendant[]
// }

// export type CustomText = {
//   placeholder: string
//   bold: boolean
//   italic: boolean
//   text: string
// }

// export type BoldCustomText = {
//   bold: boolean
//   text: string
// }

// declare module 'slate' {
//   interface CustomTypes {
//     Element: HeadingElement | ListItemElement
//     Text: CustomText
//   }
// }

import {
  BaseText,
  BaseEditor,
  BaseSelection,
  BasePoint,
  BaseRange,
  BaseElement,
} from 'slate'
// import { Prettify } from './prettify'

export type HeadingElement = {
  type: 'heading'
  level: number
} & BaseElement

export type ListItemElement = {
  type: 'list-item'
  depth: number
} & BaseElement

export type CustomText = {
  placeholder: string
  bold: boolean
  italic: boolean
} & BaseText

export type CustomElement = HeadingElement | ListItemElement

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor
    Element: CustomElement
    Text: CustomText
    Node: CustomElement | CustomText
    Point: BasePoint
    Range: BaseRange
    Selection: BaseSelection
  }
}
