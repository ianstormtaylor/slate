/* eslint-disable no-console */

import React, { useState, useMemo, useCallback } from 'react'
import faker from 'faker'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { ENETDOWN } from 'constants'

const HEADINGS = 5
const PARAGRAPHS = 5
const initialValue = []

for (let h = 0; h < HEADINGS; h++) {
  initialValue.push({
    type: 'heading',
    key: { id: `h${h}` },
    children: [
      {
        text: faker.lorem.sentence(),
        key: { id: `h${h}t` },
      },
    ],
  })

  for (let p = 0; p < PARAGRAPHS; p++) {
    initialValue.push({
      key: { id: `h${h}p${p}` },
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
  const [selection, setSelection] = useState(null)

  const onKeyDown = event => {
    if (event.key.length > 1) {
      return
    }
    event.preventDefault()
    const { path, offset } = editor.selection.focus
    const _value = JSON.parse(JSON.stringify(value))
    const _textNode = _value[path[0]].children[0]
    _textNode.text =
      _textNode.text.slice(0, offset) + event.key + _textNode.text.slice(offset)
    _value[path[0]].key.id += '1'
    setValue(_value)

    const _selection = JSON.parse(JSON.stringify(editor.selection))
    _selection.focus.offset += 1
    _selection.anchor.offset += 1
    setSelection(_selection)
  }

  if (selection) {
    editor.selection = selection
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

export default ControlledKeyExample
