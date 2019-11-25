import React, { useState, useMemo, useCallback } from 'react'
import faker from 'faker'
import { createEditor } from 'slate'
import { Editable, withReact } from 'slate-react'

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

const HugeDocumentExample = () => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Editable
      editor={editor}
      value={value}
      renderElement={renderElement}
      onChange={v => setValue(v)}
      spellCheck
      autoFocus
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
