import React, { useState, useMemo } from 'react'
import isUrl from 'is-url'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { Editor, Range, createEditor } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

const LinkExample = () => {
  const [value, setValue] = useState(initialValue)
  const [selection, setSelection] = useState(null)
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate
      editor={editor}
      value={value}
      selection={selection}
      onChange={(value, selection) => {
        setValue(value)
        setSelection(selection)
      }}
    >
      <Toolbar>
        <LinkButton />
      </Toolbar>
      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withLinks = editor => {
  const { exec, isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.exec = command => {
    if (command.type === 'insert_link') {
      const { url } = command

      if (editor.selection) {
        wrapLink(editor, url)
      }

      return
    }

    let text

    if (command.type === 'insert_data') {
      text = command.data.getData('text/plain')
    } else if (command.type === 'insert_text') {
      text = command.text
    }

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      exec(command)
    }
  }

  return editor
}

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, { match: { type: 'link' } })
  return !!link
}

const unwrapLink = editor => {
  Editor.unwrapNodes(editor, { match: { type: 'link' } })
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Editor.insertNodes(editor, link)
  } else {
    Editor.wrapNodes(editor, link, { split: true })
    Editor.collapse(editor, { edge: 'end' })
  }
}

const Element = ({ attributes, children, element }) => {
  switch (element.type) {
    case 'link':
      return (
        <a {...attributes} href={element.url}>
          {children}
        </a>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}

const LinkButton = () => {
  const editor = useSlate()
  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={event => {
        event.preventDefault()
        const url = window.prompt('Enter the URL of the link:')
        if (!url) return
        editor.exec({ type: 'insert_link', url })
      }}
    >
      <Icon>link</Icon>
    </Button>
  )
}

const initialValue = [
  {
    children: [
      {
        text: 'In addition to block nodes, you can create inline nodes, like ',
      },
      {
        type: 'link',
        url: 'https://en.wikipedia.org/wiki/Hypertext',
        children: [{ text: 'hyperlinks' }],
      },
      {
        text: '!',
      },
    ],
  },
  {
    children: [
      {
        text:
          'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
      },
    ],
  },
]

export default LinkExample
