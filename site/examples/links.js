import React, { useMemo } from 'react'
import isUrl from 'is-url'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

const LinkExample = () => {
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
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
      wrapLink(editor, url)
    } else {
      exec(command)
    }
  }

  return editor
}

const isLinkActive = editor => {
  const { selection } = editor
  return !!(selection && Editor.match(editor, selection, { type: 'link' }))
}

const unwrapLink = editor => {
  Editor.unwrapNodes(editor, { match: { type: 'link' } })
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const link = { type: 'link', url, children: [] }
  Editor.wrapNodes(editor, link, { split: true })
  Editor.collapse(editor, { edge: 'end' })
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
        marks: [],
      },
      {
        type: 'link',
        url: 'https://en.wikipedia.org/wiki/Hypertext',
        children: [
          {
            text: 'hyperlinks',
            marks: [],
          },
        ],
      },
      {
        text: '!',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text:
          'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
        marks: [],
      },
    ],
  },
]

export default LinkExample
