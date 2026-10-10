import React, { useMemo } from 'react'
import { createEditor, Descendant, Editor, Node, NodeEntry, Range } from 'slate'
import { Slate, Editable, withReact, RenderLeafProps } from 'slate-react'

const withNoUppercase = (editor: Editor) => {
  const { insertText } = editor
  editor.insertText = (text, options) => {
    if (!/[A-Z]/.test(text)) {
      insertText(text, options)
    }
  }
  return editor
}

const decorate = ([node, path]: NodeEntry): Range[] =>
  Node.isText(node) && node.text.length >= 3
    ? [
        {
          anchor: { path, offset: 0 },
          focus: { path, offset: 3 },
          highlight: true,
        },
      ]
    : []

const renderLeaf = ({ attributes, children, leaf }: RenderLeafProps) => (
  <span
    {...attributes}
    style={
      'highlight' in leaf && leaf.highlight
        ? { backgroundColor: '#ffeeba' }
        : undefined
    }
  >
    {children}
  </span>
)

const InsertTextNoopExample = () => {
  const editor = useMemo(() => withNoUppercase(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Uppercase letters are ignored."
      />
    </Slate>
  )
}

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'abcdef' }] },
]

export default InsertTextNoopExample
