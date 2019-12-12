import React, { useState, useMemo, useCallback } from 'react'
import faker from 'faker'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const HEADINGS = 100
const PARAGRAPHS = 7
const initialValue = []

for (let h = 0; h < HEADINGS; h++) {
  initialValue.push({
    type: 'heading',
    children: [{ text: faker.lorem.sentence() }],
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    initialValue.push({
      children: [{ text: faker.lorem.paragraph() }],
    })
  }
}

const HugeDocumentExample = () => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Editable renderElement={renderElement} spellCheck autoFocus />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading':
      return <h1 {...attributes}>{children}</h1>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default HugeDocumentExample
