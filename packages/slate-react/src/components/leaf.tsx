import React from 'react'
import { Element, Text, BaseText } from 'slate'
// import { Text } from './custom-extensions'
import String from './string'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { RenderLeafProps } from './editable'

/**
 * Individual leaves in a text node with unique formatting.
 */

const Leaf = (props: {
  isLast: boolean
  leaf: Text
  parent: Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
  text: Text
}) => {
  const {
    leaf,
    isLast,
    text,
    parent,
    renderLeaf = (props: RenderLeafProps) => <DefaultLeaf {...props} />,
  } = props

  let children = (
    <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
  )

  const placeholder = 'placeholder' in leaf && leaf.placeholder

  if (leaf[PLACEHOLDER_SYMBOL]) {
    children = (
      <React.Fragment>
        <span
          contentEditable={false}
          style={{
            pointerEvents: 'none',
            display: 'inline-block',
            width: '0',
            maxWidth: '100%',
            whiteSpace: 'nowrap',
            opacity: '0.333',
            userSelect: 'none',
            fontStyle: 'normal',
            fontWeight: 'normal',
            textDecoration: 'none',
          }}
        >
          {placeholder as React.ReactNode}
        </span>
        {children}
      </React.Fragment>
    )
  }

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  const attributes: {
    'data-slate-leaf': true
  } = {
    'data-slate-leaf': true,
  }

  return renderLeaf({ attributes, children, leaf, text })
}

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  const nextLeaf = next.leaf as BaseText
  const prevLeaf = prev.leaf as BaseText

  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.renderLeaf === prev.renderLeaf &&
    next.text === prev.text &&
    Text.matches(nextLeaf, prevLeaf)
  )
})

/**
 * The default custom leaf renderer.
 */

export const DefaultLeaf = (props: RenderLeafProps) => {
  const { attributes, children } = props
  return <span {...attributes}>{children}</span>
}

export default MemoizedLeaf
