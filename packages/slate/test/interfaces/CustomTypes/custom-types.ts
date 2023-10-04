import {
  BaseEditor,
  BaseSelection,
  BasePoint,
  BaseRange,
  Descendant,
  Operation,
} from 'slate'

export type HeadingElement = {
  type: 'heading'
  level: number
  children: Descendant[]
}

export type ListItemElement = {
  type: 'list-item'
  depth: number
  children: Descendant[]
}

export type CustomText = {
  placeholder?: string
  bold?: boolean
  italic?: boolean
  text: string
}

export type CustomOperation = {
  type: 'custom_op'
  value: string
}

export type ExtendedOperation = Operation | CustomOperation

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
    Operation: ExtendedOperation
  }
}
