import React, { useCallback, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

const HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underlined',
  'mod+`': 'code',
}

const TEXT_FORMATS = ['bold', 'italic', 'underlined', 'code']
const LIST_FORMATS = ['numbered-list', 'bulleted-list']
const BLOCK_FORMATS = [
  ...LIST_FORMATS,
  'heading-one',
  'heading-two',
  'block-quote',
]

const RichTextExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(
    () => withRichText(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Toolbar>
        <FormatButton format="bold" icon="format_bold" />
        <FormatButton format="italic" icon="format_italic" />
        <FormatButton format="underlined" icon="format_underlined" />
        <FormatButton format="code" icon="code" />
        <FormatButton format="heading-one" icon="looks_one" />
        <FormatButton format="heading-two" icon="looks_two" />
        <FormatButton format="block-quote" icon="format_quote" />
        <FormatButton format="numbered-list" icon="format_list_numbered" />
        <FormatButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              editor.exec({ type: 'toggle_format', format: HOTKEYS[hotkey] })
            }
          }
        }}
      />
    </Slate>
  )
}

const withRichText = editor => {
  const { exec } = editor

  editor.exec = command => {
    if (command.type === 'toggle_format') {
      const { format } = command
      const isActive = isFormatActive(editor, format)
      const isList = LIST_FORMATS.includes(format)

      if (TEXT_FORMATS.includes(format)) {
        Editor.setNodes(
          editor,
          { [format]: isActive ? null : true },
          { match: 'text', split: true }
        )
      }

      if (BLOCK_FORMATS.includes(format)) {
        for (const f of LIST_FORMATS) {
          Editor.unwrapNodes(editor, { match: { type: f }, split: true })
        }

        Editor.setNodes(editor, {
          type: isActive ? 'paragraph' : isList ? 'list-item' : format,
        })

        if (!isActive && isList) {
          Editor.wrapNodes(editor, { type: format, children: [] })
        }
      }
    } else {
      exec(command)
    }
  }

  return editor
}

const isFormatActive = (editor, format) => {
  if (TEXT_FORMATS.includes(format)) {
    const [match] = Editor.nodes(editor, {
      match: { [format]: true },
      mode: 'all',
    })

    return !!match
  }

  if (BLOCK_FORMATS.includes(format)) {
    const [match] = Editor.nodes(editor, {
      match: { type: format },
      mode: 'all',
    })

    return !!match
  }

  return false
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'block-quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'heading-one':
      return <h1 {...attributes}>{children}</h1>
    case 'heading-two':
      return <h2 {...attributes}>{children}</h2>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    default:
      return <p {...attributes}>{children}</p>
  }
}

const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underlined) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const FormatButton = ({ format, icon }) => {
  const editor = useSlate()
  return (
    <Button
      active={isFormatActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        editor.exec({ type: 'toggle_format', format })
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default RichTextExample
