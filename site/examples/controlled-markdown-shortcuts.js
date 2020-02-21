/* eslint-disable no-console */

import React, { useState, useMemo, useCallback, useRef } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'

const SHORTCUTS = {
  '*': 'list-item',
  '-': 'list-item',
  '+': 'list-item',
  '>': 'block-quote',
  '#': 'heading-one',
  '##': 'heading-two',
  '###': 'heading-three',
  '####': 'heading-four',
  '#####': 'heading-five',
  '######': 'heading-six',
}

let i = 0

const initialValue = [
  {
    type: 'heading-one',
    id: ++i,
    children: [
      {
        id: `${i}leaf`,
        text: 'Controlled Markdown Shortcut Example',
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
          'This example has the same functionality as the "Markdown Shortcuts" example. However, in our implementation we are cloning the state in onChange, mutating it, and rendering the results.',
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
          "We are also overriding the `editor.findKey` method so that we don't re-render all of the children on every update.",
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
          'For the simplicity of this example, we have disabled the ENTER key. When you are managing your own keys, you must handle new blocks and splitting blocks in your own state management.',
      },
    ],
  },
]

const ControlledMarkdownShortcutsExample = () => {
  const [editorState, setEditorState] = useState({
    value: initialValue,
    selection: null,
  })
  const renderElement = useCallback(props => <Element {...props} />, [])

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
    // For this example, we'll disable the ENTER key for simplicity.
    // In practice, you would need to handle this in your state management
    //   by adding a new child to the editor `value` with a unique key.
    if (event.key === 'Enter') {
      event.preventDefault()
    }
  }

  const onChange = value => {
    if (!editor.selection) {
      return
    }
    const { path } = editor.selection.focus
    const _value = JSON.parse(JSON.stringify(value))
    const _selection = JSON.parse(JSON.stringify(editor.selection))

    const _node = _value[path[0]]
    const _textNode = _node.children[0]
    const _md = _textNode.text.split(' ')[0]
    const _nextType = SHORTCUTS[_md]
    if (_nextType) {
      _node.type = _nextType
      _textNode.text = _textNode.text.substr(_md.length + 1)

      // we've removed some characters, so move our caret back to 0
      _selection.focus.offset = 0
      _selection.anchor.offset = 0
    }

    // we batch our state updates so our children and selection stay in sync
    setEditorState({ value: _value, selection: _selection })
  }

  if (editorState.selection) {
    editor.selection = editorState.selection
  }

  return (
    <Slate editor={editor} value={editorState.value} onChange={onChange}>
      <Editable onKeyDown={onKeyDown} renderElement={renderElement} autoFocus />
    </Slate>
  )
}

const Element = ({ attributes, children, element }) => {
  console.log('Element.render')
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'heading-four':
      return <h4 {...attributes}>{children}</h4>
    case 'heading-five':
      return <h5 {...attributes}>{children}</h5>
    case 'heading-six':
      return <h6 {...attributes}>{children}</h6>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    default:
      return <p {...attributes}>{children}</p>
  }
}

export default ControlledMarkdownShortcutsExample
