import React, { useState } from 'react'
import isUrl from 'is-url'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import { withHistory } from 'slate-history'

import { Button, Icon, Toolbar } from '../components'

class LinkEditor extends withHistory(withReact(Editor)) {
  insertData(data) {
    const text = data.getData('text/plain')

    if (isUrl(text)) {
      this.wrapLink(url)
    } else {
      super.insertData(data)
    }
  }

  isInline(element) {
    return element.type === 'link'
  }

  isLinkActive() {
    const { selection } = this.value

    if (selection) {
      for (const [node] of this.elements({ at: selection })) {
        if (node.type === 'link') {
          return true
        }
      }
    }

    return false
  }

  unwrapLink() {
    this.unwrapNodes({ match: { type: 'link' } })
  }

  wrapLink(url) {
    if (this.isLinkActive()) {
      this.unwrapLink()
    }

    const link = { type: 'link', url, nodes: [] }
    this.wrapNodes(link, { split: true })
    this.collapse({ edge: 'end' })
  }
}

const LinkExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(LinkEditor)
  return (
    <div>
      <Toolbar>
        <LinkButton />
      </Toolbar>
      <Editable
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        renderElement={props => <Element {...props} />}
        onChange={change => setValue(change.value)}
      />
    </div>
  )
}

const LinkButton = ({ editor }) => {
  return (
    <Button
      active={editor.isLinkActive()}
      onMouseDown={event => {
        event.preventDefault()
        const { selection } = editor.value
        if (!selection) return

        if (editor.isLinkActive()) {
          editor.unwrapLink()
          return
        }

        const url = window.prompt('Enter the URL of the link:')
        if (!url) return

        const text = Range.isCollapsed(selection)
          ? window.prompt('Enter the text for the link:')
          : null

        if (text != null) {
          editor.insertText(text)
          editor.move({ distance: text.length, reverse: true })
        }

        editor.wrapLink(url)
      }}
    >
      <Icon>link</Icon>
    </Button>
  )
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

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      nodes: [
        {
          text:
            'In addition to block nodes, you can create inline nodes, like ',
          marks: [],
        },
        {
          type: 'link',
          url: 'https://en.wikipedia.org/wiki/Hypertext',
          nodes: [
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
      nodes: [
        {
          text:
            'This example shows hyperlinks in action. It features two ways to add links. You can either add a link via the toolbar icon above, or if you want in on a little secret, copy a URL to your keyboard and paste it while a range of text is selected.',
          marks: [],
        },
      ],
    },
  ],
}

export default LinkExample
