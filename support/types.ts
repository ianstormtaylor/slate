import { BaseEditor, BaseElement, BaseSelection, BaseText } from 'slate'

// Allowed tags for jsx elements and allowed types for those tags
declare global {
  namespace jsx.JSX {
    interface IntrinsicElements {
      editor: GenericAdditions
      fragment: {}

      selection: {}
      cursor: {}
      anchor: {} | { path: number[]; offset: number }
      focus: {} | { path: number[]; offset: number }

      element: ElementFlags & ElementAdditions
      text: TextAdditions

      block: Omit<ElementFlags, 'inline'> & ElementAdditions
      inline: Omit<ElementFlags, 'inline'> & ElementAdditions
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

// prettier-ignore
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
    Editor: BaseEditor &
      GenericAdditions &
      CustomTypes['PackageSpecificEditorForTests']
    Element: BaseElement & ElementFlags & ElementAdditions
    Text: BaseText & TextAdditions

    Selection: BaseSelection & GenericAdditions
  }
}
