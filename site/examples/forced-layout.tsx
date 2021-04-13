import React, { useState, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Transforms, Element, createEditor, Node, Value } from 'slate'
import { withHistory } from 'slate-history'

const ForcedLayoutExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(
    () => withLayout(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        renderElement={renderElement}
        placeholder="Enter a title…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const renderElement = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
  }
}

const withLayout = editor => {
  const { normalizeNode } = editor

  editor.normalizeNode = ([node, path]) => {
    if (path.length === 0) {
      if (editor.children.length < 1) {
        Transforms.insertNodes(
          editor,
          { type: 'heading-two', children: [{ text: 'Untitled' }] },
          { at: path.concat(0) }
        )
      }

      if (editor.children.length < 2) {
        Transforms.insertNodes(
          editor,
          { type: 'paragraph', children: [{ text: '' }] },
          { at: path.concat(1) }
        )
      }

      for (const [child, childPath] of Node.children(editor, path)) {
        const type = childPath[0] === 0 ? 'heading-two' : 'paragraph'
        if (Element.isElement(child) && child.type !== type) {
          Transforms.setNodes(editor, { type }, { at: childPath })
        }
      }
    }

    return normalizeNode([node, path])
  }

  return editor
}

const initialValue: Value = [
  {
    type: 'heading-two',
    children: [{ text: 'Enforce Your Layout!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how to enforce your layout with domain-specific constraints. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
      },
    ],
  },
]

export default ForcedLayoutExample
