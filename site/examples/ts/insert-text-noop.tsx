import React, { useMemo } from 'react'
import { createEditor, Descendant, Editor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

// Regression test for https://github.com/ianstormtaylor/slate/issues/5152
// A custom `insertText` that does nothing for uppercase characters should
// leave the DOM untouched too, not just the Slate document.
const withNoUppercase = (editor: Editor) => {
  const { insertText } = editor

  editor.insertText = text => {
    if (/[A-Z]/.test(text)) {
      return
    }

    insertText(text)
  }

  return editor
}

const InsertTextNoopExample = () => {
  const editor = useMemo(() => withNoUppercase(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable placeholder="Type an uppercase letter, it should be ignored..." />
    </Slate>
  )
}

// COMPAT: native character insertion only kicks in when the selection isn't
// at offset 0 (see editable.tsx), so start with existing text.
const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: 'abc' }],
  },
]

export default InsertTextNoopExample
