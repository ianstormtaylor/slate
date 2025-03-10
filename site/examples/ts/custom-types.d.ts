import { Descendant, BaseEditor, BaseRange, Range, Element } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

export type BlockQuoteElement = {
  type: 'block-quote'
  align?: string
  children: Descendant[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  align?: string
  children: Descendant[]
}

export type CheckListItemElement = {
  type: 'check-list-item'
  checked: boolean
  children: Descendant[]
}

export type EditableVoidElement = {
  type: 'editable-void'
  children: EmptyText[]
}

export type HeadingElement = {
  type: 'heading-one'
  align?: string
  children: Descendant[]
}

export type HeadingTwoElement = {
  type: 'heading-two'
  align?: string
  children: Descendant[]
}

export type HeadingThreeElement = {
  type: 'heading-three'
  align?: string
  children: Descendant[]
}

export type HeadingFourElement = {
  type: 'heading-four'
  align?: string
  children: Descendant[]
}

export type HeadingFiveElement = {
  type: 'heading-five'
  align?: string
  children: Descendant[]
}

export type HeadingSixElement = {
  type: 'heading-six'
  align?: string
  children: Descendant[]
}

export type ImageElement = {
  type: 'image'
  url: string
  children: EmptyText[]
}

export type LinkElement = { type: 'link'; url: string; children: Descendant[] }

export type ButtonElement = { type: 'button'; children: Descendant[] }

export type BadgeElement = { type: 'badge'; children: Descendant[] }

export type ListItemElement = { type: 'list-item'; children: Descendant[] }

export type NumberedListItemElement = {
  type: 'numbered-list'
  children: Descendant[]
}

export type MentionElement = {
  type: 'mention'
  character: string
  children: CustomText[]
}

export type ParagraphElement = {
  type: 'paragraph'
  align?: string
  children: Descendant[]
}

export type TableElement = { type: 'table'; children: TableRow[] }

export type TableCellElement = { type: 'table-cell'; children: CustomText[] }

export type TableRowElement = { type: 'table-row'; children: TableCell[] }

export type TitleElement = { type: 'title'; children: Descendant[] }

export type VideoElement = { type: 'video'; url: string; children: EmptyText[] }

export type CodeBlockElement = {
  type: 'code-block'
  language: string
  children: Descendant[]
}

export type CodeLineElement = {
  type: 'code-line'
  children: Descendant[]
}

export type CustomElementWithAlign =
  | ParagraphElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | BlockQuoteElement
  | BulletedListElement

type CustomElement =
  | BlockQuoteElement
  | BulletedListElement
  | CheckListItemElement
  | EditableVoidElement
  | HeadingElement
  | HeadingTwoElement
  | HeadingThreeElement
  | HeadingFourElement
  | HeadingFiveElement
  | HeadingSixElement
  | ImageElement
  | LinkElement
  | ButtonElement
  | BadgeElement
  | ListItemElement
  | NumberedListItemElement
  | MentionElement
  | ParagraphElement
  | TableElement
  | TableRowElement
  | TableCellElement
  | TitleElement
  | VideoElement
  | CodeBlockElement
  | CodeLineElement

export type CustomElementType = CustomElement['type']

export type CustomText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  underline?: boolean
  strikethrough?: boolean
  // MARKDOWN PREVIEW SPECIFIC LEAF
  underlined?: boolean
  title?: boolean
  list?: boolean
  hr?: boolean
  blockquote?: boolean
  text: string
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>

export type EmptyText = {
  text: string
}

export type RenderElementPropsFor<T> = RenderElementProps & {
  element: T
}

export type CustomEditor = BaseEditor &
  ReactEditor &
  HistoryEditor & {
    nodeToDecorations?: Map<Element, Range[]>
  }

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
    Range: BaseRange & {
      [key: string]: unknown
    }
  }
}
