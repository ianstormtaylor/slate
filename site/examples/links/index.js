import React, { useState } from 'react'
import { Editor as BaseEditor, Range } from 'slate'
import isUrl from 'is-url'
import { Editor, withReact, useSlate } from 'slate-react'
import { withHistory } from 'slate-history'

import initialValue from './value.json'
import { Button, Icon, Toolbar } from '../components'

// Define a custom editor with link-specific logic.
class ExampleEditor extends withHistory(withReact(BaseEditor)) {
  insertData(data) {
    const text = data.getData('text/plain')

    if (isUrl(text)) {
      if (this.isLinkActive()) {
        this.unwrapLink()
      } else {
        this.wrapLink(url)
      }
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
    const link = { type: 'link', url, nodes: [] }
    this.wrapNodes(link, { split: true })
    this.collapse({ edge: 'end' })
  }
}

// Define our example React component which renders the example.
const Example = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ExampleEditor)
  return (
    <div>
      <Toolbar>
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
      </Toolbar>
      <Editor
        placeholder="Enter some text..."
        editor={editor}
        value={value}
        renderElement={props => <Element {...props} />}
        onChange={change => setValue(change.value)}
      />
    </div>
  )
}

// A component to handle rendering all of the element nodes in our editor.
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

export default Example
