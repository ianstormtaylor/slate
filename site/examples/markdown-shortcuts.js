import React, { useCallback, useState } from 'react'
import { Editable, withReact, useSlate } from 'slate-react'
import { Editor, Range } from 'slate'
import { withHistory } from 'slate-history'

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

class MarkdownShortcutsEditor extends withHistory(withReact(Editor)) {
  insertText(text, options = {}) {
    const { at } = options
    const { selection } = this.value

    if (text === ' ' && !at && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const block = this.getMatch(anchor, 'block')
      const path = block ? block[1] : []
      const start = this.getStart(path)
      const range = { anchor, focus: start }
      const text = this.getText(range)
      const type = SHORTCUTS[text]

      if (type) {
        this.select(range)
        this.delete()
        this.setNodes({ type }, { match: 'block' })

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', nodes: [] }
          this.wrapNodes(list, { match: { type: 'list-item' } })
        }

        return
      }
    }

    super.insertText(text, options)
  }
}

const MarkdownShortcutsExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(MarkdownShortcutsEditor)
  const renderElement = useCallback(props => <Element {...props} />, [])
  return (
    <div>
      <Editable
        spellCheck
        autoFocus
        placeholder="Write some markdown..."
        editor={editor}
        value={value}
        renderElement={renderElement}
        onChange={value => setValue(value)}
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

const initialValue = {
  selection: null,
  annotations: {},
  nodes: [
    {
      nodes: [
        {
          text:
            'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
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
      nodes: [
        {
          text:
            'Order when you start a line with "## " you get a level-two heading, like this:',
          marks: [],
        },
      ],
    },
    {
      type: 'heading-two',
      nodes: [
        {
          text: 'Try it out!',
          marks: [],
        },
      ],
    },
    {
      nodes: [
        {
          text:
            'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
          marks: [],
        },
      ],
    },
  ],
}

export default MarkdownShortcutsExample
