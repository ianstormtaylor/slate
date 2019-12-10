import React, { useState, useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { defineSchema } from 'slate-schema'

const withSchema = defineSchema([
  {
    for: 'node',
    match: 'editor',
    validate: {
      children: [
        { match: { type: 'title' }, min: 1, max: 1 },
        { match: { type: 'paragraph' }, min: 1 },
      ],
    },
    normalize: (editor, error) => {
      const { code, path } = error
      const [index] = path
      const type = index === 0 ? 'title' : 'paragraph'

      switch (code) {
        case 'child_invalid':
        case 'child_max_invalid': {
          Editor.setNodes(editor, { type }, { at: path })
          break
        }

        case 'child_min_invalid': {
          const block = { type, children: [{ text: '' }] }
          Editor.insertNodes(editor, block, { at: path })
          break
        }
      }
    },
  },
])

const ForcedLayoutExample = () => {
  const [value, setValue] = useState(initialValue)
  const [selection, setSelection] = useState(null)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(
    () => withSchema(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate
      editor={editor}
      value={value}
      selection={selection}
      onChange={(value, selection) => {
        setValue(value)
        setSelection(selection)
      }}
    >
      <Editable
        renderElement={renderElement}
        placeholder="Enter a title…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'title':
      return <h2 {...attributes}>{children}</h2>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
  }
}

const initialValue = [
  {
    type: 'title',
    children: [{ text: 'Enforce Your Layout!' }],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows how to enforce your layout with schema-specific rules. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
      },
    ],
  },
]

export default ForcedLayoutExample
