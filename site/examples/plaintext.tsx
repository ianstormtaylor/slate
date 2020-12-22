import React, { useState, useMemo } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue = [
  {
    children: [
      { text: 'This is editable plain text, just like a <textarea>!' },
    ],
  },
]

export default PlainTextExample
