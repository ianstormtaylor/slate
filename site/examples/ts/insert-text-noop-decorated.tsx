import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant, Editor, NodeEntry, Range, Text } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react'

import { CustomText } from './custom-types.d'

// Regression test for https://github.com/ianstormtaylor/slate/issues/5152,
// specifically for a text node split into multiple rendered leaves by a
// decoration (as opposed to marks, which already disable native insertion).
// Typing into the *undecorated* remainder of such a text node should behave
// exactly like the plain, single-leaf case.
const withNoUppercase = (editor: Editor) => {
  const { insertText } = editor

  editor.insertText = text => {
    if (/[A-Z]/.test(text)) {
      return
    }

    insertText(text)
  }

  return editor
}

const decorate = ([node, path]: NodeEntry): Range[] => {
  if (!Text.isText(node) || node.text.length < 3) {
    return []
  }

  return [
    {
      anchor: { path, offset: 0 },
      focus: { path, offset: 3 },
      highlight: true,
    },
  ]
}

interface HighlightLeaf extends CustomText {
  highlight?: boolean
}

const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props
  const highlightLeaf = leaf as HighlightLeaf
  return (
    <span
      {...attributes}
      style={
        highlightLeaf.highlight ? { backgroundColor: '#ffeeba' } : undefined
      }
    >
      {children}
    </span>
  )
}

const InsertTextNoopDecoratedExample = () => {
  const editor = useMemo(() => withNoUppercase(withReact(createEditor())), [])
  const decorateCallback = useCallback(decorate, [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        decorate={decorateCallback}
        renderLeaf={renderLeaf}
        placeholder="Type an uppercase letter after the highlighted part, it should be ignored..."
      />
    </Slate>
  )
}

// COMPAT: native character insertion only kicks in when the selection isn't
// at offset 0 (see editable.tsx), so start with existing text. The first 3
// characters are decorated (see `decorate` above), splitting this text node
// into 2 leaves; typing happens in the undecorated remainder.
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'abcdef' }],
  },
]

export default InsertTextNoopDecoratedExample
