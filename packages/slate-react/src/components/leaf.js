import React from 'react'
import Types from 'prop-types'
import SlateTypes from 'slate-prop-types'
import ImmutableTypes from 'react-immutable-proptypes'

import OffsetKey from '../utils/offset-key'
import DATA_ATTRS from '../constants/data-attributes'

/**
 * Leaf strings with text in them.
 *
 * @type {Component}
 */

const TextString = ({ text = '', isTrailing = false }) => {
  return (
    <span
      {...{
        [DATA_ATTRS.STRING]: true,
      }}
    >
      {text}
      {isTrailing ? '\n' : null}
    </span>
  )
}

/**
 * Leaf strings without text, render as zero-width strings.
 *
 * @type {Component}
 */

const ZeroWidthString = ({ length = 0, isLineBreak = false }) => {
  return (
    <span
      {...{
        [DATA_ATTRS.ZERO_WIDTH]: isLineBreak ? 'n' : 'z',
        [DATA_ATTRS.LENGTH]: length,
      }}
    >
      {'\uFEFF'}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

/**
 * Individual leaves in a text node with unique formatting.
 *
 * @type {Component}
 */

const Leaf = props => {
  const {
    marks,
    annotations,
    decorations,
    node,
    index,
    offset,
    text,
    editor,
    parent,
    block,
    leaves,
  } = props

  const offsetKey = OffsetKey.stringify({
    key: node.key,
    index,
  })

  let children

  if (editor.query('isVoid', parent)) {
    // COMPAT: Render text inside void nodes with a zero-width space.
    // So the node can contain selection but the text is not visible.
    children = <ZeroWidthString length={parent.text.length} />
  } else if (
    text === '' &&
    parent.object === 'block' &&
    parent.text === '' &&
    parent.nodes.last() === node
  ) {
    // COMPAT: If this is the last text node in an empty block, render a zero-
    // width space that will convert into a line break when copying and pasting
    // to support expected plain text.
    children = <ZeroWidthString isLineBreak />
  } else if (text === '') {
    // COMPAT: If the text is empty, it's because it's on the edge of an inline
    // node, so we render a zero-width space so that the selection can be
    // inserted next to it still.
    children = <ZeroWidthString />
  } else {
    // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
    // so we need to add an extra trailing new lines to prevent that.
    const lastText = block.getLastText()
    const lastChar = text.charAt(text.length - 1)
    const isLastText = node === lastText
    const isLastLeaf = index === leaves.size - 1

    if (isLastText && isLastLeaf && lastChar === '\n') {
      children = <TextString isTrailing text={text} />
    } else {
      children = <TextString text={text} />
    }
  }

  const renderProps = {
    editor,
    marks,
    annotations,
    decorations,
    node,
    offset,
    text,
  }

  // COMPAT: Having the `data-` attributes on these leaf elements ensures that
  // in certain misbehaving browsers they aren't weirdly cloned/destroyed by
  // contenteditable behaviors. (2019/05/08)
  for (const mark of marks) {
    const ret = editor.run('renderMark', {
      ...renderProps,
      mark,
      children,
      attributes: {
        [DATA_ATTRS.OBJECT]: 'mark',
      },
    })

    if (ret) {
      children = ret
    }
  }

  for (const decoration of decorations) {
    const ret = editor.run('renderDecoration', {
      ...renderProps,
      decoration,
      children,
      attributes: {
        [DATA_ATTRS.OBJECT]: 'decoration',
      },
    })

    if (ret) {
      children = ret
    }
  }

  for (const annotation of annotations) {
    const ret = editor.run('renderAnnotation', {
      ...renderProps,
      annotation,
      children,
      attributes: {
        [DATA_ATTRS.OBJECT]: 'annotation',
      },
    })

    if (ret) {
      children = ret
    }
  }

  const attrs = {
    [DATA_ATTRS.LEAF]: true,
    [DATA_ATTRS.OFFSET_KEY]: offsetKey,
  }

  return <span {...attrs}>{children}</span>
}

/**
 * Prop types.
 *
 * @type {Object}
 */

Leaf.propTypes = {
  annotations: ImmutableTypes.list.isRequired,
  block: SlateTypes.block.isRequired,
  decorations: ImmutableTypes.list.isRequired,
  editor: Types.object.isRequired,
  index: Types.number.isRequired,
  leaves: Types.object.isRequired,
  marks: SlateTypes.marks.isRequired,
  node: SlateTypes.node.isRequired,
  offset: Types.number.isRequired,
  parent: SlateTypes.node.isRequired,
  text: Types.string.isRequired,
}

/**
 * A memoized version of `Leaf` that updates less frequently.
 *
 * @type {Component}
 */

const MemoizedLeaf = React.memo(Leaf, (prev, next) => {
  return (
    next.block === prev.block &&
    next.index === prev.index &&
    next.marks === prev.marks &&
    next.parent === prev.parent &&
    next.text === prev.text &&
    next.annotations.equals(prev.annotations) &&
    next.decorations.equals(prev.decorations)
  )
})

/**
 * Export.
 *
 * @type {Component}
 */

export default MemoizedLeaf
