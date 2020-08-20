import { Text, createEditor, Node, Element, Editor, Descendant } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement

    Node: CustomNode
  }
}

interface CustomElement {
  type?: string
  checked?: boolean
  url?: string
  children: Descendant[]
}

type CustomNode = Editor | CustomElement | Text
