import React, { useMemo, useState } from 'react'
import isHotkey from 'is-hotkey'
import {
  Editable,
  withReact,
  useSlate,
  Slate,
  EditableProps,
  RenderElementProps,
  useSelected,
  useFocused,
  ReactEditor,
} from 'slate-react'
import { Editor, Transforms, createEditor, Element, MarksOf } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Button, Icon, Toolbar } from '../components'
import { css } from 'emotion'

type FormattedText = {
  bold?: boolean
  italic?: boolean
  code?: boolean
  underline?: boolean
  text: string
}

type BulletedList = {
  type: 'bulleted-list'
  children: ListItem[]
}

type HeadingThree = {
  type: 'heading-three'
  children: FormattedText[]
}

type Image = {
  type: 'image'
  url: string
  children: [FormattedText]
}

type Link = {
  type: 'link'
  url: string
  children: FormattedText[]
}

type ListItem = {
  type: 'list-item'
  children: (Link | FormattedText)[]
}

type NumberedList = {
  type: 'numbered-list'
  children: ListItem[]
}

type Paragraph = {
  type: 'paragraph'
  children: (Link | FormattedText)[]
}

type Quote = {
  type: 'quote'
  children: (Link | FormattedText)[]
}

type MyElements =
  | Paragraph
  | Quote
  | Image
  | HeadingThree
  | BulletedList
  | NumberedList

type MyValue = MyElements[]

type MyEditor = ReactEditor<MyValue> & HistoryEditor<MyValue>

type MyMarks = MarksOf<MyEditor>

const TypeScriptExample = () => {
  const [value, setValue] = useState(initialValue)
  const editor = useMemo(
    () => withHistory(withReact(createEditor<MyValue>())),
    []
  )

  return (
    // Because of the TypeScript-awareness you'll also get an error if you
    // initialize the editor with an invalid value or other invalid props.
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar>
        <MarkButton format="bold" icon="format_bold" />
        <MarkButton format="italic" icon="format_italic" />
        <MarkButton format="underline" icon="format_underlined" />
        <MarkButton format="code" icon="code" />
        <BlockButton format="heading-three" icon="looks_three" />
        <BlockButton format="quote" icon="format_quote" />
        <BlockButton format="numbered-list" icon="format_list_numbered" />
        <BlockButton format="bulleted-list" icon="format_list_bulleted" />
      </Toolbar>
      <Editable<MyValue>
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        placeholder="Enter some rich text…"
        spellCheck
        autoFocus
        onKeyDown={event => {
          for (const hotkey in HOTKEYS) {
            if (isHotkey(hotkey, event as any)) {
              event.preventDefault()
              const mark = HOTKEYS[hotkey]
              toggleMark(editor, mark)
            }
          }
        }}
      />
    </Slate>
  )
}

const HOTKEYS: Record<string, keyof MyMarks> = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const toggleBlock = (
  editor: Editor<MyValue>,
  format: MyElements['type']
): void => {
  const isActive = isBlockActive(editor, format)
  const listTypes = ['numbered-list', 'bulleted-list']
  const isList = listTypes.includes(format)
  const newType = isActive ? 'paragraph' : isList ? 'list-item' : format

  Transforms.unwrapNodes(editor, {
    match: n =>
      listTypes.includes(
        !Editor.isEditor(n) &&
          Element.isElement(n) &&
          typeof n.type === 'string' &&
          n.type
      ),
    split: true,
  })

  Transforms.setNodes(editor, { type: newType })

  if (!isActive && isList) {
    const block = { type: format, children: [] } as any
    Transforms.wrapNodes(editor, block)
  }
}

const toggleMark = (editor: Editor<MyValue>, format: keyof MyMarks): void => {
  const isActive = isMarkActive(editor, format)
  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isBlockActive = (
  editor: Editor<MyValue>,
  format: MyElements['type']
): boolean => {
  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) && Element.isElement(n) && n.type === format,
  })
  return !!match
}

const isMarkActive = (
  editor: Editor<MyValue>,
  format: keyof MyMarks
): boolean => {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

const renderElement: EditableProps<MyValue>['renderElement'] = ({
  attributes,
  children,
  element,
}) => {
  // The `element.type` is aware of what types are available in your editor, so
  // if you try to define an unknown type it will complain.
  switch (element.type) {
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'heading-three':
      return <h3 {...attributes}>{children}</h3>
    case 'paragraph':
      return <p {...attributes}>{children}</p>
    case 'bulleted-list':
      return <ul {...attributes}>{children}</ul>
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'list-item':
      return <li {...attributes}>{children}</li>
    case 'link':
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      )
    case 'image':
      return (
        <Image attributes={attributes} children={children} element={element} />
      )
    // And because of this exhaustiveness check for the `default` case, if you
    // forget to define a rendererer for one of your elements it will fail too.
    default:
      const unhandled: never = element
      throw new Error(`Forgot to handle element type: ${unhandled}`)
  }
}

const Image: React.FC<{
  attributes: RenderElementProps<MyValue>['attributes']
  children: RenderElementProps<MyValue>['children']
  element: Image
}> = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      <div contentEditable={false}>
        <img
          src={element.url}
          className={css`
            display: block;
            max-width: 100%;
            max-height: 20em;
            box-shadow: ${selected && focused ? '0 0 0 3px #B4D5FF' : 'none'};
          `}
        />
      </div>
      {children}
    </div>
  )
}

const renderLeaf: EditableProps<MyValue>['renderLeaf'] = ({
  attributes,
  children,
  leaf,
}) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton: React.FC<{
  format: MyElements['type']
  icon: string
}> = ({ format, icon }) => {
  const editor = useSlate<MyValue>()
  return (
    <Button
      active={isBlockActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleBlock(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton: React.FC<{
  format: keyof MyMarks
  icon: string
}> = ({ format, icon }) => {
  const editor = useSlate<MyValue>()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={event => {
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

// Slate is TypeScript-aware, so if you try to use any unrecognizes `type`
// properties in this initial value you will get a compiler error.
const initialValue: MyValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'All the Slate examples are written in TypeScript. However, ',
      },
      { text: 'most', italic: true },
      { text: ' of them use ' },
      { text: 'implicit', bold: true },
      {
        text:
          " typings in many places because it makes it easier to see the actual Slate-specific code—especially for people who don't know TypeScript.",
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'This example is written with ' },
      { text: 'explicit', bold: true },
      {
        text:
          ' typings in all places, so you can see what a more realistic TypeScript usage would look like.',
      },
    ],
  },
  {
    type: 'heading-three',
    children: [{ text: 'Quotes' }],
  },
  {
    type: 'paragraph',
    children: [{ text: "We'll throw in a few things like quotes…" }],
  },
  {
    type: 'quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'heading-three',
    children: [{ text: 'Images' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'And images…' }],
  },
  {
    type: 'image',
    url: 'https://source.unsplash.com/kFrdX5IeQzI',
    children: [{ text: '' }],
  },
]

export default TypeScriptExample
