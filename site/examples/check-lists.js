import React, { useState } from 'react'
import { Editor, Range, Point } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'
import {
  Editable,
  withReact,
  useSlate,
  useEditor,
  useReadOnly,
} from 'slate-react'

class CheckListsEditor extends withHistory(withReact(Editor)) {
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

const CheckListsExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useSlate(CheckListsEditor)
  return (
    <div>
      <Editable
        spellCheck
        autoFocus
        editor={editor}
        value={value}
        placeholder="Get to work..."
        renderElement={props => <Element {...props} />}
        onChange={v => setValue(v)}
      />
    </div>
  )
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'check-list-item':
      return <CheckListItemElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const CheckListItemElement = ({ attributes, children, element }) => {
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

const initialValue = {
  selection: null,
  annotations: {},
  children: [
    {
      children: [
        {
          text:
            'With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [
        {
          text: 'Slide to the left.',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [
        {
          text: 'Slide to the right.',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [
        {
          text: 'Criss-cross.',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: true,
      children: [
        {
          text: 'Criss-cross!',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [
        {
          text: 'Cha cha real smooth…',
          marks: [],
        },
      ],
    },
    {
      type: 'check-list-item',
      checked: false,
      children: [
        {
          text: "Let's go to work!",
          marks: [],
        },
      ],
    },
    {
      children: [
        {
          text: 'Try it out for yourself!',
          marks: [],
        },
      ],
    },
  ],
}

export default CheckListsExample
