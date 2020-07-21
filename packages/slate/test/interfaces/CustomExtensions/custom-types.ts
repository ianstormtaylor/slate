import { CustomExtensions, Descendant, Element, Text } from 'slate'

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
  interface CustomExtensions {
    Element: HeadingElement | ListItemElement
    Text: CustomText | BoldCustomText
  }
}
