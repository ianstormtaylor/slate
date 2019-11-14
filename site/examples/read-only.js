import React, { useState } from 'react'
import { Editor } from 'slate'
import { Editable, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

const ReadOnlyEditor = withHistory(withReact(Editor))

const ReadOnlyExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ReadOnlyEditor)
  return (
    <Editable
      placeholder="Enter some plain text..."
      readOnly
      editor={editor}
      value={value}
      onChange={v => setValue(v)}
    />
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      children: [
        {
          text: 'This is editable plain text, just like a <textarea>!',
          marks: [],
        },
      ],
    },
  ],
}

export default ReadOnlyExample
