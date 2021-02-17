import React, { useState, useMemo, useCallback } from 'react'
import { Node, createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

const PlainTextExample = () => {
  const [value, setValue] = useState<Node[]>(initialValue)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [placeholder, setPlaceholder] = useState(1)
  const newPlaceholder = useCallback(() => setPlaceholder(p => p + 1), [])

  return (
    <>
      <button onClick={newPlaceholder}>New Placeholder</button>
      <Slate editor={editor} value={value} onChange={setValue}>
        <Editable placeholder={`${placeholder}`} />
      </Slate>
      <div>Actual placeholder value: {placeholder}</div>
      <p>Placeholder will not update until you type something in the editor</p>
    </>
  )
}

const initialValue = [
  {
    children: [{ text: '' }],
  },
]

export default PlainTextExample
