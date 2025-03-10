import { faker } from '@faker-js/faker'
import React, { useCallback, useMemo } from 'react'
import { createEditor } from 'slate'
import { Editable, Slate, withReact } from 'slate-react'

const HEADINGS = 100
const PARAGRAPHS = 7
const initialValue = []
for (let h = 0; h < HEADINGS; h++) {
  const heading = {
    type: 'heading-one',
    children: [{ text: faker.lorem.sentence() }],
  }
  initialValue.push(heading)
  for (let p = 0; p < PARAGRAPHS; p++) {
    const paragraph = {
      type: 'paragraph',
      children: [{ text: faker.lorem.paragraph() }],
    }
    initialValue.push(paragraph)
  }
}
const HugeDocumentExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} spellCheck autoFocus />
    </Slate>
  )
}
const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    default:
      return <p {...attributes}>{children}</p>
  }
}
export default HugeDocumentExample
