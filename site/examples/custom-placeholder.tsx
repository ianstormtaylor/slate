import React, { useState, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import {
  Slate,
  Editable,
  withReact,
  defaultPlaceholderStyle,
} from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable
        placeholder="Type something"
        renderPlaceholder={({ children, ...attrs }) => (
          <div {...attrs} style={defaultPlaceholderStyle}>
            <p>{children}</p>
            <pre>
              Use the renderPlaceholder prop to customize rendering of the
              placeholder
            </pre>
          </div>
        )}
      />
    </Slate>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [{ text: '' }],
  },
]

export default PlainTextExample
