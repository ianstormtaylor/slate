import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Editable
      editor={editor}
      value={value}
      onChange={v => setValue(v)}
      placeholder="Enter some plain text..."
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

export default PlainTextExample
