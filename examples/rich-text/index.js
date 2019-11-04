import React, { useState, useMemo } from 'react'
import isHotkey from 'is-hotkey'
import { Editor as BaseEditor } from 'slate'
import { Editor, withReact } from 'slate-react'
import { withHistory } from 'slate-history'

import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

class ExampleEditor extends withHistory(withReact(BaseEditor)) {
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

  renderElement(props) {
    return <Element {...props} />
  }

  renderMark(props) {
    return <Mark {...props} />
  }

  isMarkActive(type) {
    const marks = this.getActiveMarks()
    const isActive = marks.some(m => m.type === type)
    return isActive
  }

  isBlockActive(type) {
    const { selection } = this.value

    if (selection) {
      for (const [node] of this.elements({ at: selection })) {
        if (node.type === type) {
          return true
        }
      }
    }

    return false
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

const Example = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ExampleEditor)
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
      <Editor
        spellCheck
        autoFocus
        editor={editor}
        value={value}
        onChange={change => setValue(change.value)}
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

export default Example
