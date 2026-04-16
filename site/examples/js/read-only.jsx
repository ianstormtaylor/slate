import { useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const ReadOnlyExample = () => {
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable placeholder="Enter some plain text..." readOnly />
    </Slate>
  )
}
const initialValue = [
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
