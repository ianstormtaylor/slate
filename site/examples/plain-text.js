import React, { useState, useMemo } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const [selection, setSelection] = useState(null)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
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
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue = [
  {
    children: [
      {
        text: '',
        marks: [],
      },
    ],
  },
]

export default PlainTextExample
