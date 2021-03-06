import React, { useState, useMemo } from 'react'
import { createEditor, Descendant, Element, Node } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const ReadOnlyExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable readOnly placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue: Element[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is editable plain text, just like a <textarea>!',
      },
    ],
  },
]

export default ReadOnlyExample
