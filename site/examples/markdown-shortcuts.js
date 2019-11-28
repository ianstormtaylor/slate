import React, { useCallback, useMemo } from 'react'
import { Slate, Editable, withReact } from 'slate-react'
import { Editor, Range, Point, createEditor } from 'slate'
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

const MarkdownShortcutsExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Write some markdown..."
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const withShortcuts = editor => {
  const { exec } = editor

  editor.exec = command => {
    const { selection } = editor

    if (
      command.type === 'insert_text' &&
      command.text === ' ' &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const { anchor } = selection
      const block = Editor.match(editor, anchor, 'block')
      const path = block ? block[1] : []
      const start = Editor.start(editor, path)
      const range = { anchor, focus: start }
      const beforeText = Editor.text(editor, range)
      const type = SHORTCUTS[beforeText]

      if (type) {
        Editor.select(editor, range)
        Editor.delete(editor)
        Editor.setNodes(editor, { type }, { match: 'block' })

        if (type === 'list-item') {
          const list = { type: 'bulleted-list', children: [] }
          Editor.wrapNodes(editor, list, { match: { type: 'list-item' } })
        }

        return
      }
    }

    if (
      command.type === 'delete_backward' &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const { anchor } = selection
      const match = Editor.match(editor, anchor, 'block')

      if (match) {
        const [block, path] = match
        const start = Editor.start(editor, path)

        if (block.type !== 'paragraph' && Point.equals(anchor, start)) {
          Editor.setNodes(editor, { type: 'paragraph' })

          if (match.type === 'list-item') {
            Editor.unwrapNodes(editor, { match: { type: 'bulleted-list' } })
          }

          return
        }
      }
    }

    exec(command)
  }

  return editor
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

const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text:
          'The editor gives you full control over the logic you can add. For example, it\'s fairly common to want to add markdown-like shortcuts to editors. So that, when you start a line with "> " you get a blockquote that looks like this:',
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
        text:
          'Order when you start a line with "## " you get a level-two heading, like this:',
        marks: [],
      },
    ],
  },
  {
    type: 'heading-two',
    children: [
      {
        text: 'Try it out!',
        marks: [],
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          'Try it out for yourself! Try starting a new line with ">", "-", or "#"s.',
        marks: [],
      },
    ],
  },
]

export default MarkdownShortcutsExample
