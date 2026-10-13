import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

const renderElement = ({ attributes, children }: RenderElementProps) => (
  <div {...attributes} contentEditable={false}>
    <span>Fixed header</span>
    <span contentEditable suppressContentEditableWarning data-test-id="island">
      {children}
    </span>
  </div>
)

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'inside' }] },
]

export default function EditableIslands() {
  const [editor] = useState(() => withReact(createEditor()))
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} />
    </Slate>
  )
}

export const getStaticProps = () =>
  process.env.NODE_ENV === 'production' ? { notFound: true } : { props: {} }
