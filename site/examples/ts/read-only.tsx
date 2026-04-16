import { useMemo } from 'react'
import { createEditor, type Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const ReadOnlyExample = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable placeholder="Enter some plain text..." readOnly />
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
