import React, { useState } from 'react'
import { Editor as BaseEditor, Range, Point } from 'slate'
import {
  Editor,
  withReact,
  useSlate,
  useEditor,
  useReadOnly,
} from 'slate-react'
import { css } from 'emotion'
import { withHistory } from 'slate-history'

import initialValue from './value.json'

// Define a custom editor with checklist-specific logic.
class ExampleEditor extends withHistory(withReact(BaseEditor)) {
  // When deleting backwards at the start of a checklist item, convert the block
  // to a paragraph instead.
  delete(options = {}) {
    const { at, reverse } = options
    const { selection } = this.value

    if (!at && reverse && selection && Range.isCollapsed(selection)) {
      const { anchor } = selection
      const match = this.getMatch(anchor, { type: 'check-list-item' })

      if (match) {
        const [, path] = match
        const start = this.getStart(path)

        if (Point.equals(anchor, start)) {
          this.setNodes(
            { type: 'paragraph' },
            { match: { type: 'check-list-item' } }
          )
          return
        }
      }
    }

    super.delete(options)
  }
}

// Define our example React component which renders the example.
const Example = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(ExampleEditor)
  return (
    <div>
      <Editor
        spellCheck
        autoFocus
        editor={editor}
        value={value}
        placeholder="Get to work..."
        renderElement={props => <Element {...props} />}
        onChange={change => setValue(change.value)}
      />
    </div>
  )
}

// A component to handle rendering all of the element nodes in our editor.
const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'check-list-item':
      return <CheckListItem {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

// A custom node for check list item elements.
const CheckListItem = ({ attributes, children, element }) => {
  const editor = useEditor()
  const readOnly = useReadOnly()
  const { checked } = element
  return (
    <div
      {...attributes}
      className={css`
        display: flex;
        flex-direction: row;
        align-items: center;

        & + & {
          margin-top: 0;
        }
      `}
    >
      <span
        contentEditable={false}
        className={css`
          margin-right: 0.75em;
        `}
      >
        <input
          type="checkbox"
          checked={checked}
          onChange={event => {
            const path = editor.findPath(element)
            editor.setNodes({ checked: event.target.checked }, { at: path })
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={css`
          flex: 1;
          opacity: ${checked ? 0.666 : 1};
          text-decoration: ${checked ? 'none' : 'line-through'};

          &:focus {
            outline: none;
          }
        `}
      >
        {children}
      </span>
    </div>
  )
}

export default Example
