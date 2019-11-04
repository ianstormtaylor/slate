import React, { useState } from 'react'
import { parsePlaintext } from 'slate-parse-plaintext'
import { Editor as BaseEditor } from 'slate'
import { Editor, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

class ExampleEditor extends withHistory(withReact(BaseEditor)) {}

const initialValue = parsePlaintext(
  'This is editable plain text, just like a <textarea>!'
)

const Example = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ExampleEditor)
  return (
    <Editor
      placeholder="Enter some plain text..."
      editor={editor}
      value={value}
      onChange={change => setValue(change.value)}
    />
  )
}

export default Example
