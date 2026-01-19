import { BaseEditor, BaseElement, BaseText, Editor, Element, Text } from 'slate'

// Allowed tags for jsx elements and allowed types for those tags
declare global {
  namespace jsx.JSX {
    interface IntrinsicElements {
      editor: Omit<Editor, keyof BaseEditor>
      fragment: {}

      selection: {}
      cursor: {}
      anchor: {} | { path: number[]; offset: number }
      focus: {} | { path: number[]; offset: number }

      element: Omit<Element, keyof BaseElement>
      text: Omit<Text, keyof BaseText>

      block: Omit<Element, keyof BaseElement | 'inline'>
      inline: Omit<Element, keyof BaseElement | 'inline'>
    }
  }
}

// elements with these attributes set return true for the relevant editor.isX methods
export interface ElementFlags {
  void?: true
  inline?: true
  readOnly?: true
  nonSelectable?: true
}

// this is for testing generic attributes we might want to test on a node
// anything prefixed with b_ is a boolean flag, s_ is a string
// so you can test theoretical custom properties like b_isItalic or s_backgroundColor
export interface GenericAdditions {
  [key: `b_${string}`]: true | undefined
  [key: `s_${string}`]: string
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & GenericAdditions
    Element: BaseElement & ElementFlags & GenericAdditions
    Text: BaseText & GenericAdditions
  }
}
