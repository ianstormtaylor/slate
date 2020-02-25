/* eslint-disable no-console */

import React, { useState, useMemo, useCallback } from 'react'
import { createEditor } from 'slate'
import { Slate, Editable, withReact } from 'slate-react'
import { createDraft, finishDraft } from 'immer'

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

const initialValue = [
  {
    type: 'heading-one',
    children: [
      {
        text: 'Controlled Update Example',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'This example has the same functionality as the "Markdown Shortcuts" example. However, in our implementation we are using `immer.js` to draft a new state in onChange, mutate it, and render the results.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try starting a line with a markdown modifier, like "#", "##", ">" or "-" and then press SPACEBAR to see the formatting applied.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'If you show the console, it should only log `Element.render` once for each keypress.',
      },
    ],
  },
]

const ControlledUpdatesExample = () => {
  const [editorState, setEditorState] = useState({
    value: initialValue,
    selection: null,
  })
  const renderElement = useCallback(props => <Element {...props} />, [])

  const editor = useMemo(() => withReact(createEditor()), [])

  const onChange = value => {
    if (!editor.selection) {
      return
    }
    const { path } = editor.selection.focus

    const _value = createDraft(value)
    const _selection = createDraft(editor.selection)

    const _node = _value[path[0]]
    const _textNode = _node.children[0]
    const _firstSpace = _textNode.text.indexOf(' ')
    const _md = _firstSpace > 0 && _textNode.text.slice(0, _firstSpace)
    const _nextType = SHORTCUTS[_md]
    if (_nextType) {
      _node.type = _nextType
      _textNode.text = _textNode.text.substr(_md.length + 1)

      // we've removed some characters, so move our caret back to 0
      _selection.focus.offset = 0
      _selection.anchor.offset = 0
    }

    // we batch our state updates so our children and selection stay in sync
    setEditorState({
      value: finishDraft(_value),
      selection: finishDraft(_selection),
    })
  }

  return (
    <Slate editor={editor} onChange={onChange} {...editorState}>
      <Editable renderElement={renderElement} autoFocus />
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

export default ControlledUpdatesExample
