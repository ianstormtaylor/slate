import React, { useMemo, useCallback, ChangeEvent } from 'react'
import {
  Slate,
  Editable,
  withReact,
  useSlateStatic,
  useReadOnly,
  ReactEditor,
  RenderElementProps,
} from 'slate-react'
import {
  Editor,
  Transforms,
  Range,
  Point,
  createEditor,
  Descendant,
  Element as SlateElement,
  BaseEditor,
} from 'slate'
import { css } from '@emotion/css'
import { withHistory } from 'slate-history'
import { CheckListItemElement, CustomEditor, RenderElementPropsFor } from './custom-types'

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'With Slate you can build complex block types that have their own embedded content and behaviors, like rendering checkboxes inside check list items!',
      },
    ],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Slide to the left.' }],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Slide to the right.' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Criss-cross.' }],
  },
  {
    type: 'check-list-item',
    checked: true,
    children: [{ text: 'Criss-cross!' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Cha cha real smooth…' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: "Let's go to work!" }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

const CheckListsExample = () => {
  const renderElement = useCallback((props: RenderElementProps) => <Element {...props} />, [])
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        renderElement={renderElement}
        placeholder="Get to work…"
        spellCheck
        autoFocus
      />
    </Slate>
  )
}

const withChecklists = (editor: CustomEditor) => {
  const { deleteBackward } = editor

  editor.deleteBackward = (...args) => {
    const { selection } = editor

    if (selection && Range.isCollapsed(selection)) {
      const [match] = Editor.nodes(editor, {
        match: n =>
          !Editor.isEditor(n) &&
          SlateElement.isElement(n) &&
          n.type === 'check-list-item',
      })

      if (match) {
        const [, path] = match
        const start = Editor.start(editor, path)

        if (Point.equals(selection.anchor, start)) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties, {
            match: n =>
              !Editor.isEditor(n) &&
              SlateElement.isElement(n) &&
              n.type === 'check-list-item',
          })
          return
        }
      }
    }

    deleteBackward(...args)
  }

  return editor
}

const Element = (props: RenderElementProps) => {
  const { attributes, children, element } = props

  switch (element.type) {
    case 'check-list-item':
      return <CheckListItemElement {...props} />
    default:
      return <p {...attributes}>{children}</p>
  }
}

const CheckListItemElement = ({ attributes, children, element }: RenderElementPropsFor<CheckListItemElement>) => {
  const { checked } = element;
  const editor = useSlateStatic()
  const readOnly = useReadOnly()
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
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const path = ReactEditor.findPath(editor, element)
            const newProperties: Partial<SlateElement> = {
              checked: event.target.checked,
            }
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
        />
      </span>
      <span
        contentEditable={!readOnly}
        suppressContentEditableWarning
        className={css`
          flex: 1;
          opacity: ${checked ? 0.666 : 1};
          text-decoration: ${!checked ? 'none' : 'line-through'};

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

export default CheckListsExample
