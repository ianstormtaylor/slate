import React from 'react'
import { Text, Element } from 'slate'
import String from './string'
import {
  CustomDecoration,
  CustomDecorationProps,
  CustomMark,
  CustomMarkProps,
  PlaceholderDecoration,
} from './custom'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { Leaf as SlateLeaf } from '../utils/leaf'

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = (props: {
  isLast: boolean
  leaf: SlateLeaf
  parent: Element
  renderDecoration?: (props: CustomDecorationProps) => JSX.Element
  renderMark?: (props: CustomMarkProps) => JSX.Element
  text: Text
}) => {
  const {
    leaf,
    isLast,
    text,
    parent,
    renderDecoration = (props: CustomDecorationProps) => (
      <CustomDecoration {...props} />
    ),
    renderMark = (props: CustomMarkProps) => <CustomMark {...props} />,
  } = props

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  )

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  for (const mark of leaf.marks) {
    const ret = renderMark({
      children,
      leaf,
      mark,
      text,
      attributes: {
        'data-slate-mark': true,
      },
    })

    if (ret) {
      children = ret
    }
  }

  for (const decoration of leaf.decorations) {
    const p = {
      children,
      decoration,
      leaf,
      text,
      attributes: {
        'data-slate-decoration': true,
      },
    }

    if (PLACEHOLDER_SYMBOL in decoration) {
      // @ts-ignore
      children = <PlaceholderDecoration {...p} />
    } else {
      // @ts-ignore
      const ret = renderDecoration(p)

      if (ret) {
        children = ret
      }
    }
  }

  return <span data-slate-leaf>{children}</span>
}

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderDecoration === prev.renderDecoration &&
    next.renderMark === prev.renderMark &&
    next.text === prev.text &&
    SlateLeaf.equals(next.leaf, prev.leaf)
  )
})

export default MemoizedLeaf
