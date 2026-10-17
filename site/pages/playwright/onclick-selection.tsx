import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'The quick brown fox jumps over the lazy dog' }],
  },
]

export default function OnClickSelection() {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        onClick={() => {
          const log = ((window as any).__clickSelections ??= [])
          log.push(editor.selection)
        }}
      />
    </Slate>
  )
}

export const getStaticProps = () =>
  process.env.NODE_ENV === 'production' ? { notFound: true } : { props: {} }
