import React from 'react'
import { Mark, Range, Text, Element } from 'slate'
import String from './string'
import {
  CustomAnnotation,
  CustomAnnotationProps,
  CustomDecoration,
  CustomDecorationProps,
  CustomMark,
  CustomMarkProps,
} from './custom'

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
  renderAnnotation?: (props: CustomAnnotationProps) => JSX.Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  text: string
}) => {
  const {
    annotations,
    block,
    decorations,
    index,
    leaves,
    marks,
    node,
    parent,
    renderAnnotation = (props: CustomAnnotationProps) => (
      <CustomAnnotation {...props} />
    ),
    renderDecoration = (props: CustomDecorationProps) => (
      <CustomDecoration {...props} />
    ),
    renderMark = (props: CustomMarkProps) => <CustomMark {...props} />,
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
    const ret = renderMark({
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
    const ret = renderDecoration({
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
    const ret = renderAnnotation({
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
