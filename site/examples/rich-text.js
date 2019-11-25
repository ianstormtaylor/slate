import React, { useCallback, useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

const MARK_HOTKEYS = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underlined',
  'mod+`': 'code',
}

const RichTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderMark = useCallback(props => <Mark {...props} />, [])
  const editor = useMemo(
    () => withRichText(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <div>
      <Toolbar>
        <MarkButton editor={editor} type="bold" icon="format_bold" />
        <MarkButton editor={editor} type="italic" icon="format_italic" />
        <MarkButton
          editor={editor}
          type="underlined"
          icon="format_underlined"
        />
        <MarkButton editor={editor} type="code" icon="code" />
        <BlockButton editor={editor} type="heading-one" icon="looks_one" />
        <BlockButton editor={editor} type="heading-two" icon="looks_two" />
        <BlockButton editor={editor} type="block-quote" icon="format_quote" />
        <BlockButton
          editor={editor}
          type="numbered-list"
          icon="format_list_numbered"
        />
        <BlockButton
          editor={editor}
          type="bulleted-list"
          icon="format_list_bulleted"
        />
      </Toolbar>
      <Editable
        editor={editor}
        value={value}
        renderElement={renderElement}
        renderMark={renderMark}
        onChange={v => setValue(v)}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in MARK_HOTKEYS) {
            if (isHotkey(hotkey, event)) {
              event.preventDefault()
              editor.exec({
                type: 'toggle_mark',
                mark: MARK_HOTKEYS[hotkey],
              })
            }
          }
        }}
      />
    </div>
  )
}

const withRichText = editor => {
  const { exec } = editor

  editor.exec = command => {
    if (command.type === 'toggle_block') {
      const { block: type } = command
      const isActive = isBlockActive(editor, type)
      const isListType = type === 'bulleted-list' || type === 'numbered-list'
      Editor.unwrapNodes(editor, { match: { type: 'bulleted-list' } })
      Editor.unwrapNodes(editor, { match: { type: 'numbered-list' } })

      const newType = isActive ? 'paragraph' : isListType ? 'list-item' : type
      Editor.setNodes(editor, { type: newType })

      if (!isActive && isListType) {
        Editor.wrapNodes(editor, { type, children: [] })
      }

      return
    }

    if (command.type === 'toggle_mark') {
      const { mark: type } = command
      const isActive = isMarkActive(editor, type)
      const cmd = isActive ? 'remove_mark' : 'add_mark'
      editor.exec({ type: cmd, mark: { type } })
      return
    }

    exec(command)
  }

  return editor
}

const isMarkActive = (editor, type) => {
  const marks = Editor.getActiveMarks(editor)
  const isActive = marks.some(m => m.type === type)
  return isActive
}

const isBlockActive = (editor, type) => {
  const { selection } = editor.value
  if (!selection) return false
  const match = Editor.getMatch(editor, selection, { type })
  return !!match
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

const Mark = ({ attributes, children, mark }) => {
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underlined':
      return <u {...attributes}>{children}</u>
  }
}

const MarkButton = ({ editor, type, icon }) => {
  return (
    <Button
      active={isMarkActive(editor, type)}
      onMouseDown={event => {
        event.preventDefault()
        editor.exec({ type: 'toggle_mark', mark: type })
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const BlockButton = ({ editor, type, icon }) => {
  return (
    <Button
      active={isBlockActive(editor, type)}
      onMouseDown={event => {
        event.preventDefault()
        editor.exec({ type: 'toggle_block', block: type })
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      type: 'paragraph',
      children: [
        {
          text: 'This is editable ',
          marks: [],
        },
        {
          text: 'rich',
          marks: [{ type: 'bold' }],
        },
        {
          text: ' text, ',
          marks: [],
        },
        {
          text: 'much',
          marks: [{ type: 'italic' }],
        },
        {
          text: ' better than a ',
          marks: [],
        },
        {
          text: '<textarea>',
          marks: [{ type: 'code' }],
        },
        {
          text: '!',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text:
            "Since it's rich text, you can do things like turn a selection of text ",
          marks: [],
        },
        {
          text: 'bold',
          marks: [{ type: 'bold' }],
        },
        {
          text:
            ', or add a semantically rendered block quote in the middle of the page, like this:',
          marks: [],
        },
      ],
    },
    {
      type: 'block-quote',
      children: [
        {
          text: 'A wise quote.',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      children: [
        {
          text: 'Try it out for yourself!',
          marks: [],
        },
      ],
    },
  ],
}

export default RichTextExample
