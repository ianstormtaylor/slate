import React, { useState, useMemo } from 'react'
import isUrl from 'is-url'
import { Slate, Editable, withReact, useSlate } from 'slate-react'
import {
  Transforms,
  Editor,
  Range,
  createEditor,
  Element as SlateElement,
  Descendant,
} from 'slate'
import { withHistory } from 'slate-history'
import { LinkElement } from './custom-types'

import { Button, Icon, Toolbar } from '../components'

const LinkExample = () => {
  const [value, setValue] = useState<Descendant[]>(initialValue)
  const editor = useMemo(
    () => withLinks(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar>
        <LinkButton />
        <RemoveLinkButton />
      </Toolbar>
      <Editable
        renderElement={props => <Element {...props} />}
        placeholder="Enter some text..."
      />
    </Slate>
  )
}

const withLinks = editor => {
  const { insertData, insertText, isInline } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.insertText = text => {
    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertText(text)
    }
  }

  editor.insertData = data => {
    const text = data.getData('text/plain')

    if (text && isUrl(text)) {
      wrapLink(editor, text)
    } else {
      insertData(data)
    }
  }

  return editor
}

const insertLink = (editor, url) => {
  if (editor.selection) {
    wrapLink(editor, url)
  }
}

const isLinkActive = editor => {
  const [link] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
  return !!link
}

const unwrapLink = editor => {
  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === 'link',
  })
}

const wrapLink = (editor, url) => {
  if (isLinkActive(editor)) {
    unwrapLink(editor)
  }

  const { selection } = editor
  const isCollapsed = selection && Range.isCollapsed(selection)
  const link: LinkElement = {
    type: 'link',
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, link)
  } else {
    Transforms.wrapNodes(editor, link, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
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
        insertLink(editor, url)
      }}
    >
      <Icon>link</Icon>
    </Button>
  )
}

const RemoveLinkButton = () => {
  const editor = useSlate()

  return (
    <Button
      active={isLinkActive(editor)}
      onMouseDown={event => {
        if (isLinkActive(editor)) {
          unwrapLink(editor)
        }
      }}
    >
      <Icon>link_off</Icon>
    </Button>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
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
    type: 'paragraph',
    children: [
      {
        text:
          'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
      },
    ],
  },
]

export default LinkExample
