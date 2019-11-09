import React, { useState } from 'react'
import { Editor } from 'slate'
import { Editable, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextEditor = withHistory(withReact(Editor))

const PlainTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(PlainTextEditor)
  return (
    <Editable
      placeholder="Enter some plain text..."
      editor={editor}
      value={value}
      onChange={setValue}
    />
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      nodes: [
        {
          text: 'This is editable plain text, just like a <textarea>!',
          marks: [],
        },
      ],
    },
  ],
}

export default PlainTextExample
