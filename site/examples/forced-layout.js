import React, { useCallback, useState } from 'react'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor } from 'slate'
import { withHistory } from 'slate-history'
import { withSchema } from 'slate-schema'

const schema = [
  {
    for: 'node',
    match: 'value',
    validate: {
      children: [
        { match: { type: 'title' }, min: 1, max: 1 },
        { match: { type: 'paragraph' }, min: 1 },
      ],
    },
    normalize: (editor, error) => {
      const { code, path, index } = error
      const type = index === 0 ? 'title' : 'paragraph'

      debugger
      switch (code) {
        case 'child_invalid': {
          editor.setNodes({ type }, { at: path })
          break
        }
        case 'child_min_invalid': {
          const block = { type, nodes: [{ text: '', marks: [] }] }
          editor.insertNodes(block, { at: path.concat(index) })
          break
        }
        case 'child_max_invalid': {
          editor.setNodes({ type }, { at: path.concat(index) })
          break
        }
      }
    },
  },
]

const ForcedLayoutEditor = withSchema(withHistory(withReact(Editor)), schema)

const ForcedLayoutExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ForcedLayoutEditor)
  const renderElement = useCallback(props => <Element {...props} />, [])
  return (
    <div>
      <Editable
        spellCheck
        autoFocus
        placeholder="Enter a title…"
        editor={editor}
        value={value}
        renderElement={renderElement}
        onChange={value => setValue(value)}
      />
    </div>
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

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      type: 'title',
      nodes: [
        {
          text: 'Enforce Your Layout!',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      nodes: [
        {
          text:
            'This example shows how to enforce your layout with schema-specific rules. This document will always have a title block at the top and at least one paragraph in the body. Try deleting them and see what happens!',
          marks: [],
        },
      ],
    },
  ],
}

export default ForcedLayoutExample
