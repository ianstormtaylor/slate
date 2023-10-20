import React, { useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const ReadOnlyExample = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable readOnly placeholder="Enter some plain text..." />
    </Slate>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This example shows what happens when the Editor is set to readOnly, it is not editable',
      },
    ],
  },
]

export default ReadOnlyExample
