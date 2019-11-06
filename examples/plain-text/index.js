import React, { useState } from 'react'
import { Editor as BaseEditor } from 'slate'
import { Editor, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

import initialValue from './value.json'

// Define an example editor with React behaviors and a history stack.
class ExampleEditor extends withHistory(withReact(BaseEditor)) {}

// Define an example React component that renders the example editor.
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
