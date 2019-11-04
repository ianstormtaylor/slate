import React from 'react'
import { Element, Range, Mark, Text } from 'slate'
import { useEditor } from '../hooks/use-editor'

/**
 * `CustomAnnotationProps` are passed to the `renderAnnotation` handler.
 */

export interface CustomAnnotationProps {
  annotation: Range
  annotations: Range[]
  children: any
  decorations: Range[]
  marks: Mark[]
  node: Text
  attributes: {
    'data-slate-annotation': true
  }
}

/**
 * The default custom annotation renderer.
 */

export const CustomAnnotation = (props: CustomAnnotationProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export interface CustomDecorationProps {
  annotations: Range[]
  children: any
  decoration: Range
  decorations: Range[]
  marks: Mark[]
  node: Text
  attributes: {
    'data-slate-decoration': true
  }
}

/**
 * The default custom decoration renderer.
 */

export const CustomDecoration = (props: CustomDecorationProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

/**
 * `CustomElementProps` are passed to the `renderElement` handler.
 */

export interface CustomElementProps {
  children: any
  element: Element
  attributes: {
    'data-slate-node': 'element'
    'data-slate-void'?: true
    dir?: 'rtl'
    ref: any
  }
}

/**
 * The default element renderer.
 */

export const CustomElement = (props: CustomElementProps) => {
  const { attributes, children, element } = props
  const editor = useEditor()
  const Tag = editor.isInline(element) ? 'span' : 'div'
  return (
    <Tag {...attributes} style={{ position: 'relative' }}>
      {children}
    </Tag>
  )
}

/**
 * `CustomMarkProps` are passed to the `renderMark` handler.
 */

export interface CustomMarkProps {
  annotations: Range[]
  children: any
  decorations: Range[]
  mark: Mark
  marks: Mark[]
  node: Text
  attributes: {
    'data-slate-mark': true
  }
}

/**
 * The default custom mark renderer.
 */

export const CustomMark = (props: CustomMarkProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}
