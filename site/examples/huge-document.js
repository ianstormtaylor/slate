import React, { useState, useCallback } from 'react'
import faker from 'faker'
import { Editor } from 'slate'
import { Editable, withReact, useSlate } from 'slate-react'

const HEADINGS = 100
const PARAGRAPHS = 7
const children = []
const initialValue = {
  selection: null,
  annotations: {},
  children,
}

for (let h = 0; h < HEADINGS; h++) {
  children.push({
    type: 'heading',
    children: [{ text: faker.lorem.sentence(), marks: [] }],
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    children.push({
      children: [{ text: faker.lorem.paragraph(), marks: [] }],
    })
  }
}

const HugeDocumentEditor = withReact(Editor)

const HugeDocumentExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(HugeDocumentEditor)
  const renderElement = useCallback(props => <Element {...props} />, [])
  return (
    <Editable
      spellCheck
      autoFocus
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={v => setValue(v)}
    />
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
