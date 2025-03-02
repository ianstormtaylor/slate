import { faker } from '@faker-js/faker'
import React, { useCallback, useMemo } from 'react'
import { createEditor, Descendant } from 'slate'
import { Editable, RenderElementProps, Slate, withReact } from 'slate-react'

import {
  CustomEditor,
  HeadingElement,
  ParagraphElement,
} from './custom-types.d'

const HEADINGS = 100
const PARAGRAPHS = 7
const initialValue: Descendant[] = []

for (let h = 0; h < HEADINGS; h++) {
  const heading: HeadingElement = {
    type: 'heading-one',
    children: [{ text: faker.lorem.sentence() }],
  }
  initialValue.push(heading)

  for (let p = 0; p < PARAGRAPHS; p++) {
    const paragraph: ParagraphElement = {
      type: 'paragraph',
      children: [{ text: faker.lorem.paragraph() }],
    }
    initialValue.push(paragraph)
  }
}

const HugeDocumentExample = () => {
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const editor = useMemo(() => withReact(createEditor()) as CustomEditor, [])
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable renderElement={renderElement} spellCheck autoFocus />
    </Slate>
  )
}

const Element = ({ attributes, children, element }: RenderElementProps) => {
  switch (element.type) {
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default HugeDocumentExample
