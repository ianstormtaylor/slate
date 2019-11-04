import React from 'react'
import { Element } from 'slate'
import { useEditor } from '../hooks/use-editor'

/**
 * The default element renderer.
 */

export const DefaultElement = (props: {
  attributes: any
  children: any
  element: Element
}) => {
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
 * The default mark renderer.
 */

export const DefaultMark = (props: { attributes: any; children: any }) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}
