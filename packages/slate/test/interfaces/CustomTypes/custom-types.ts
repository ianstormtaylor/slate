import { Descendant, Element, Text, CustomTypes } from 'slate'

export interface HeadingElement {
  type: 'heading'
  level: number
  children: Descendant[]
}

export interface ListItemElement {
  type: 'list-item'
  depth: number
  children: Descendant[]
}

export interface CustomText {
  placeholder: string
  text: string
}

export interface BoldCustomText {
  bold: boolean
  text: string
}

declare module 'slate' {
  interface CustomTypes {
    Element: HeadingElement | ListItemElement
    Text: CustomText | BoldCustomText
  }
}
