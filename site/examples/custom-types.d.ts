import { Text, createEditor, Node, Element, Editor, Descendant } from 'slate'

declare module 'slate' {
  interface CustomTypes {
    Element: CustomElement
    Editor: Editor & { type: string }
    Node: Node & { type: string }
  }
}

interface CustomElement {
  type?: string
  checked?: boolean
  children: Descendant[]
}
