import {
  BaseEditor,
  BaseElement,
  BaseSelection,
  BaseText,
  Editor,
  Element,
  Text,
} from 'slate'

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
  markable?: true
  inline?: true
  readOnly?: true
  nonSelectable?: true
}

// eslint-disable-next-line prettier/prettier
type singleLetter = 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'h' | 'i' | 'j' | 'k' | 'l' | 'm' | 'n' | 'o' | 'p' | 'q' | 'r' | 's' | 't' | 'u' | 'v' | 'w' | 'x' | 'y' | 'z'

type SingleLetterFlags = {
  [key in singleLetter]?: true
}

// arbitrary attributes used to differentiate nodes
export interface GenericAdditions extends SingleLetterFlags {
  id?: string

  old?: true
  new?: true
  pass?: true
  match?: true

  // arbitrary keys I found people using, mostly for setNodes testing
  // TODO: consolidate and/or rename meaningfully
  data?: unknown
  key?: unknown
  someKey?: unknown
  alreadyHasAKey?: unknown
  attr?: unknown
  custom?: unknown

  // this is for testing generic attributes we might want to test on a node
  // anything prefixed with b_ is a boolean flag, s_ is a string
  // so you can test theoretical custom properties like b_isItalic or s_backgroundColor
  [key: `f_${string}`]: true | undefined
  [key: `s_${string}`]: string | undefined
}

// arbitrary attributes used to differentiate elements
export interface ElementAdditions extends GenericAdditions {
  type?: string
}

// arbitrary attributes used to differentiate text
export interface TextAdditions extends GenericAdditions {
  bold?: true
  italic?: true
  underline?: true

  mark?: string
  decoration?: number[]
}

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & GenericAdditions
    Element: BaseElement & ElementFlags & ElementAdditions
    Text: BaseText & TextAdditions

    Selection: BaseSelection & GenericAdditions
  }
}
