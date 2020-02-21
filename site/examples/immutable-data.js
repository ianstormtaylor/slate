/* eslint-disable no-console */

import React, { useState, useMemo, useCallback, useRef } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

let i = 0

const initialValue = [
  {
    type: 'heading',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text: 'Controlled Immutable Value Example',
      },
    ],
  },
  {
    type: 'paragraph',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text:
          'In this example we are capturing keypresses, cloning the state, mutating it, and rendering the results.',
      },
    ],
  },
  {
    type: 'paragraph',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text:
          "We are also overriding the `editor.findKey` method so that we don't re-render all of the children on every keypress.",
      },
    ],
  },
  {
    type: 'paragraph',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text:
          'If you show the console, it should only log `Element.render` once for each keypress.',
      },
    ],
  },
  {
    type: 'paragraph',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text:
          'Keep in mind that we have only mapped some keys, so control characters like ENTER or BACKSPACE will not work.',
      },
    ],
  },
]

const ImmutableDataExample = () => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const [selection, setSelection] = useState(null)

  const nodeKeysRef = useRef({})

  const withKeys = editor => {
    const { findKey } = editor
    editor.findKey = element => {
      const { id } = element
      if (!nodeKeysRef.current[id]) {
        nodeKeysRef.current[id] = findKey(element)
      }
      return nodeKeysRef.current[id]
    }
    return editor
  }

  const editor = useMemo(() => withKeys(withReact(createEditor())), [])

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
    <Slate editor={editor} value={value}>
      <Editable renderElement={renderElement} onKeyDown={onKeyDown} autoFocus />
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

export default ImmutableDataExample
