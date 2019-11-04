import React from 'react'
import { Text, Path, Element } from 'slate'
import { useEditor } from '../hooks/use-editor'

/**
 * Leaf content strings.
 */

const String = ({
  node,
  index,
  text,
  parent,
  block,
  leaves,
}: {
  node: Text
  index: number
  text: string
  parent: Element
  block: Element | null
  leaves: any[]
}) => {
  const editor = useEditor()
  const path = editor.findPath(node)!
  const parentPath = Path.parent(path)

  // COMPAT: Render text inside void nodes with a zero-width space.
  // So the node can contain selection but the text is not visible.
  if (editor.isVoid(parent)) {
    return <ZeroWidthString length={parent.text.length} />
  }

  // COMPAT: If this is the last text node in an empty block, render a zero-
  // width space that will convert into a line break when copying and pasting
  // to support expected plain text.
  if (
    text === '' &&
    parent.nodes[parent.nodes.length - 1] === node &&
    !editor.isInline(parent) &&
    editor.getText(parentPath) === ''
  ) {
    return <ZeroWidthString isLineBreak />
  }

  // COMPAT: If the text is empty, it's because it's on the edge of an inline
  // node, so we render a zero-width space so that the selection can be
  // inserted next to it still.
  if (text === '') {
    return <ZeroWidthString />
  }

  // COMPAT: Browsers will collapse trailing new lines at the end of blocks,
  // so we need to add an extra trailing new lines to prevent that.
  if (block) {
    const lastText = block.getLastText()
    const lastChar = text.charAt(text.length - 1)
    const isLastText = node === lastText
    const isLastLeaf = index === leaves.length - 1

    if (isLastText && isLastLeaf && lastChar === '\n') {
      return <TextString isTrailing text={text} />
    }
  }

  return <TextString text={text} />
}

/**
 * Leaf strings with text in them.
 */

const TextString = (props: { text: string; isTrailing?: boolean }) => {
  const { text, isTrailing = false } = props
  return (
    <span data-slate-string>
      {text}
      {isTrailing ? '\n' : null}
    </span>
  )
}

/**
 * Leaf strings without text, render as zero-width strings.
 */

const ZeroWidthString = (props: { length?: number; isLineBreak?: boolean }) => {
  const { length = 0, isLineBreak = false } = props
  return (
    <span
      data-slate-zero-width={isLineBreak ? 'n' : 'z'}
      data-slate-length={length}
    >
      {'\uFEFF'}
      {isLineBreak ? <br /> : null}
    </span>
  )
}

export default String
