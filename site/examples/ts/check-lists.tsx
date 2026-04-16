import { css } from '@emotion/css'
import { type ChangeEvent, useCallback, useMemo } from 'react'
import {
  createEditor,
  type Descendant,
  Editor,
  Node,
  Point,
  Range,
  type Element as SlateElement,
  Transforms,
} from 'slate'
import { withHistory } from 'slate-history'
import {
  Editable,
  ReactEditor,
  type RenderElementProps,
  Slate,
  useReadOnly,
  useSlateStatic,
  withReact,
} from 'slate-react'
import type {
  CheckListItemElement as CheckListItemType,
  CustomEditor,
  RenderElementPropsFor,
} from './custom-types.d'

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
  const renderElement = useCallback(
    (props: RenderElementProps) => <Element {...props} />,
    []
  )
  const editor = useMemo(
    () => withChecklists(withHistory(withReact(createEditor()))),
    []
  )

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        autoFocus
        placeholder="Get to work…"
        renderElement={renderElement}
        spellCheck
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
        match: (n) => Node.isElement(n) && n.type === 'check-list-item',
      })

      if (match) {
        const [, path] = match
        const start = Editor.start(editor, path)

        if (Point.equals(selection.anchor, start)) {
          const newProperties: Partial<SlateElement> = {
            type: 'paragraph',
          }
          Transforms.setNodes(editor, newProperties, {
            match: (n) => Node.isElement(n) && n.type === 'check-list-item',
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

const CheckListItemElement = ({
  attributes,
  children,
  element,
}: RenderElementPropsFor<CheckListItemType>) => {
  const { checked } = element
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
        className={css`
          margin-right: 0.75em;
        `}
        contentEditable={false}
      >
        <input
          checked={checked}
          onChange={(event: ChangeEvent<HTMLInputElement>) => {
            const path = ReactEditor.findPath(editor, element)
            const newProperties: Partial<SlateElement> = {
              checked: event.target.checked,
            }
            Transforms.setNodes(editor, newProperties, { at: path })
          }}
          type="checkbox"
        />
      </span>
      <span
        className={css`
          flex: 1;
          opacity: ${checked ? 0.666 : 1};
          text-decoration: ${checked ? 'line-through' : 'none'};

          &:focus {
            outline: none;
          }
        `}
        contentEditable={!readOnly}
        suppressContentEditableWarning
      >
        {children}
      </span>
    </div>
  )
}

export default CheckListsExample
