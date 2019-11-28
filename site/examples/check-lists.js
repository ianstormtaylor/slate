import React, { useMemo, useCallback } from 'react'
import { Slate, Editable, withReact, useEditor, useReadOnly } from 'slate-react'
import { Editor, Range, Point, createEditor } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'

const CheckListsExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Get to work…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const withChecklists = editor => {
  const { exec } = editor

  editor.exec = command => {
    const { selection } = editor

    if (
      command.type === 'delete_backward' &&
      selection &&
      Range.isCollapsed(selection)
    ) {
      const { anchor } = selection
      const match = Editor.match(editor, anchor, {
        type: 'check-list-item',
      })

      if (match) {
        const [, path] = match
        const start = Editor.start(editor, path)

        if (Point.equals(anchor, start)) {
          Editor.setNodes(
            editor,
            { type: 'paragraph' },
            { match: { type: 'check-list-item' } }
          )
          return
        }
      }
    }

    exec(command)
  }

  return editor
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

const initialValue = [
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
]

export default CheckListsExample
