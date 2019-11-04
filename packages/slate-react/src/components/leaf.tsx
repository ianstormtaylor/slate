import React from 'react'
import { Mark, Range, Text, Element } from 'slate'
import { useEditor } from '../hooks/use-editor'
import String from './string'

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = (props: {
  annotations: Range[]
  block: Element | null
  decorations: Range[]
  index: number
  leaves: any[]
  marks: Mark[]
  node: Text
  parent: Element
  text: string
}) => {
  const editor = useEditor()
  const {
    annotations,
    block,
    decorations,
    index,
    leaves,
    marks,
    node,
    parent,
    text,
  } = props

  const renderProps = {
    marks,
    annotations,
    decorations,
    node,
    text,
  }

  let children = (
    <String
      node={node}
      index={index}
      text={text}
      parent={parent}
      block={block}
      leaves={leaves}
    />
  )

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  for (const mark of marks) {
    const ret = editor.renderMark({
      ...renderProps,
      mark,
      children,
      attributes: {
        'data-slate-mark': true,
      },
    })

    if (ret) {
      children = ret
    }
  }

  for (const decoration of decorations) {
    const ret = editor.renderDecoration({
      ...renderProps,
      decoration,
      children,
      attributes: {
        'data-slate-decoration': true,
      },
    })

    if (ret) {
      children = ret
    }
  }

  for (const annotation of annotations) {
    const ret = editor.renderAnnotation({
      ...renderProps,
      annotation,
      children,
      attributes: {
        'data-slate-annotation': true,
      },
    })

    if (ret) {
      children = ret
    }
  }

  return <span data-slate-leaf>{children}</span>
}

export default Leaf
