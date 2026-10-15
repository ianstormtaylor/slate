import React, { useState } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const values = ['alpha', 'beta', 'gamma']

const EditorFixture = ({ isolated }: { isolated: boolean }) => {
  const [editor] = useState(() => {
    const editor = withReact(createEditor())
    editor.isIsolated = () => isolated
    return editor
  })
  return (
    <Slate
      editor={editor}
      initialValue={values.map(
        (text): Descendant => ({ type: 'paragraph', children: [{ text }] })
      )}
    >
      <Editable aria-label={isolated ? 'Isolated' : 'Slate'} />
    </Slate>
  )
}

export default function TripleClickFixture() {
  return (
    <div style={{ lineHeight: '32px', padding: '32px' }}>
      <div
        role="textbox"
        aria-label="Native"
        contentEditable
        suppressContentEditableWarning
      >
        {values.map(text => (
          <div key={text}>{text}</div>
        ))}
      </div>
      <EditorFixture isolated={false} />
      <EditorFixture isolated />
    </div>
  )
}
