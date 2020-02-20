/* eslint-disable no-console */

import React, { useState, useMemo, useCallback } from 'react'
import faker from 'faker'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const HEADINGS = 5
const PARAGRAPHS = 5
const initialValue = []

for (let h = 0; h < HEADINGS; h++) {
  initialValue.push({
    type: 'heading',
    children: [
      {
        text: faker.lorem.sentence(),
        key: { id: `h${h}t` },
      },
    ],
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    initialValue.push({
      children: [
        {
          text: faker.lorem.paragraph(),
          key: { id: `h${h}p${p}t` },
        },
      ],
    })
  }
}

const ControlledKeyExample = () => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(() => withReact(createEditor()), [])

  const onKeyDown = event => {
    console.log(editor.selection.focus)
    event.preventDefault()
    const _value = cloneDeep(value)
    _value[3].children[0].text += event.key
    _value[3].key.id += '1'
    setValue(_value)
  }

  return (
    <Slate editor={editor} value={value} onChange={() => null}>
      <Editable
        renderElement={renderElement}
        onKeyDown={onKeyDown}
        spellCheck={false}
        autoFocus
      />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  console.log('Element.render')
  switch (element.type) {
    case 'heading':
      return <h1 {...attributes}>{children}</h1>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default HugeDocumentExample
