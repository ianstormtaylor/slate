import React, { useState, useMemo } from 'react'
import { createEditor, Descendant, Element } from 'slate'
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

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows what happens when the Editor is set to readOnly, it is not editable',
      },
    ],
  },
]

export default ReadOnlyExample
