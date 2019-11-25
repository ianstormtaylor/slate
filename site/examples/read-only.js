import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, withReact } from 'slate-react'

const ReadOnlyExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Editable
      readOnly
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

export default ReadOnlyExample
