import React from 'react'
import { Element, Text } from 'slate'
import String from './string'
import { PLACEHOLDER_SYMBOL } from '../utils/weak-maps'
import { RenderLeafProps } from './editable'

export type DefaultLeafProps = RenderLeafProps &
  Omit<React.HTMLAttributes<HTMLSpanElement>, keyof RenderLeafProps>

export const DefaultLeaf: React.FC<DefaultLeafProps> = ({
  attributes,
  children,
  leaf,
  text,
  ...props
}) => {
  if (leaf[PLACEHOLDER_SYMBOL]) {
    return (
      <span
        {...props}
        {...attributes}
        style={{
          position: 'relative',
          display: 'inline-block',
          minWidth: '100%',
          width: '100%',
        }}
      >
        <span
          contentEditable={false}
          style={{
            display: 'inline-block',
            pointerEvents: 'none',
            userSelect: 'none',
            minWidth: '100%',
            width: '100%',
            opacity: 0.45,
          }}
        >
          {leaf.placeholder}
        </span>

        <span
          style={{
            display: 'inline-block',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
          }}
        >
          {children}
        </span>
      </span>
    )
  }

  return (
    <span {...props} {...attributes}>
      {children}
    </span>
  )
}
DefaultLeaf.displayName = 'DefaultLeaf'

interface LeafProps {
  isLast: boolean
  leaf: Text
  text: Text
  parent: Element
  renderLeaf?: (props: RenderLeafProps) => JSX.Element
}

const renderDefaultLeaf: LeafProps['renderLeaf'] = props => (
  <DefaultLeaf {...props} />
)

const Leaf: React.FC<LeafProps> = ({
  isLast,
  leaf,
  text,
  parent,
  renderLeaf = renderDefaultLeaf,
}) => {
  return renderLeaf({
    attributes: {
      'data-slate-leaf': true,
    },
    leaf,
    text,
    children: (
      <String isLast={isLast} leaf={leaf} parent={parent} text={text} />
    ),
  })
}
Leaf.displayName = 'Leaf'

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  return (
    next.parent === prev.parent &&
    next.isLast === prev.isLast &&
    next.text === prev.text &&
    next.leaf.text === prev.leaf.text &&
    next.leaf[PLACEHOLDER_SYMBOL] === prev.leaf[PLACEHOLDER_SYMBOL] &&
    next.renderLeaf === prev.renderLeaf &&
    Text.matches(next.leaf, prev.leaf)
  )
})

export default MemoizedLeaf
