import React from 'react'
import { Element, Range, Mark, Text } from 'slate'

import { useEditor } from '../hooks/use-editor'
import { Leaf } from '../utils/leaf'

export interface CustomDecorationProps {
  children: any
  decoration: Range
  leaf: Leaf
  text: Text
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
    'data-slate-inline'?: true
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
  children: any
  mark: Mark
  leaf: Leaf
  text: Text
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

/**
 * A custom decoration for the default placeholder behavior.
 */

export const PlaceholderDecoration = (props: CustomDecorationProps) => {
  const { decoration, attributes, children } = props
  const { placeholder } = decoration
  return (
    <span {...attributes}>
      <span
        contentEditable={false}
        style={{
          pointerEvents: 'none',
          display: 'inline-block',
          verticalAlign: 'text-top',
          width: '0',
          maxWidth: '100%',
          whiteSpace: 'nowrap',
          opacity: '0.333',
        }}
      >
        {placeholder}
      </span>
      {children}
    </span>
  )
}
