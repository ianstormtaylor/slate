import React, { useCallback, useState } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

class RichTextEditor extends withHistory(withReact(Editor)) {
  isMarkActive(type) {
    const marks = this.getActiveMarks()
    const isActive = marks.some(m => m.type === type)
    return isActive
  }

  isBlockActive(type) {
    const { selection } = this.value
    if (!selection) return false
    const match = this.getMatch(selection, { type })
    return !!match
  }

  onKeyDown(event) {
    let type

    if (isHotkey('mod+b', event)) {
      type = 'bold'
    } else if (isHotkey('mod+i', event)) {
      type = 'italic'
    } else if (isHotkey('mod+u', event)) {
      type = 'underlined'
    } else if (isHotkey('mod+`', event)) {
      type = 'code'
    } else {
      return super.onKeyDown(event)
    }

    event.preventDefault()
    this.toggleMarks([{ type }])
  }

  toggleBlocks(type) {
    const isActive = this.isBlockActive(type)
    const isListType = type === 'bulleted-list' || type === 'numbered-list'
    this.unwrapNodes({ match: { type: 'bulleted-list' } })
    this.unwrapNodes({ match: { type: 'numbered-list' } })

    const newType = isActive ? 'paragraph' : isListType ? 'list-item' : type
    this.setNodes({ type: newType })

    if (!isActive && isListType) {
      this.wrapNodes({ type, nodes: [] })
    }
  }
}

const RichTextExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(RichTextEditor)
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderMark = useCallback(props => <Mark {...props} />, [])
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
        spellCheck
        autoFocus
        editor={editor}
        value={value}
        renderElement={renderElement}
        renderMark={renderMark}
        onChange={setValue}
      />
    </div>
  )
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
      active={editor.isMarkActive(type)}
      onMouseDown={event => {
        const mark = { type }
        event.preventDefault()
        editor.toggleMarks([mark])
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const BlockButton = ({ editor, type, icon }) => {
  return (
    <Button
      active={editor.isBlockActive(type)}
      onMouseDown={event => {
        event.preventDefault()
        editor.toggleBlocks(type)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      type: 'paragraph',
      nodes: [
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
      nodes: [
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
      nodes: [
        {
          text: 'A wise quote.',
          marks: [],
        },
      ],
    },
    {
      type: 'paragraph',
      nodes: [
        {
          text: 'Try it out for yourself!',
          marks: [],
        },
      ],
    },
  ],
}

export default RichTextExample
