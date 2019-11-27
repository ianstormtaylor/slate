import React, { useCallback, useMemo } from 'react'
import { jsx } from 'slate-hyperscript'
import { Editor, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { css } from 'emotion'
import {
  Slate,
  Editable,
  withReact,
  useSelected,
  useFocused,
} from 'slate-react'

const ELEMENT_TAGS = {
  A: el => ({ type: 'link', url: el.getAttribute('href') }),
  BLOCKQUOTE: () => ({ type: 'quote' }),
  H1: () => ({ type: 'heading-one' }),
  H2: () => ({ type: 'heading-two' }),
  H3: () => ({ type: 'heading-three' }),
  H4: () => ({ type: 'heading-four' }),
  H5: () => ({ type: 'heading-five' }),
  H6: () => ({ type: 'heading-six' }),
  IMG: el => ({ type: 'image', url: el.getAttribute('src') }),
  LI: () => ({ type: 'list-item' }),
  OL: () => ({ type: 'numbered-list' }),
  P: () => ({ type: 'paragraph' }),
  PRE: () => ({ type: 'code' }),
  UL: () => ({ type: 'bulleted-list' }),
}

const MARK_TAGS = {
  CODE: () => ({ type: 'code' }),
  DEL: () => ({ type: 'strikethrough' }),
  EM: () => ({ type: 'italic' }),
  I: () => ({ type: 'italic' }),
  S: () => ({ type: 'strikethrough' }),
  STRONG: () => ({ type: 'bold' }),
  U: () => ({ type: 'underline' }),
}

export const deserialize = el => {
  if (el.nodeType === 3) {
    return el.textContent
  } else if (el.nodeType !== 1) {
    return null
  } else if (el.nodeName === 'BR') {
    return '\n'
  }

  const { nodeName } = el
  let parent = el

  if (
    el.nodeNode === 'PRE' &&
    el.childNodes[0] &&
    el.childNodes[0].nodeName === 'CODE'
  ) {
    parent = el.childNodes[0]
  }

  const children = Array.from(parent.childNodes).map(deserialize)

  if (el.nodeName === 'BODY') {
    return jsx('fragment', {}, children)
  }

  if (ELEMENT_TAGS[nodeName]) {
    const attrs = ELEMENT_TAGS[nodeName](el)
    return jsx('element', attrs, children)
  }

  if (MARK_TAGS[nodeName]) {
    const attrs = MARK_TAGS[nodeName](el)
    return jsx('mark', attrs, children)
  }

  return children
}

const PasteHtmlExample = () => {
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderMark = useCallback(props => <Mark {...props} />, [])
  const editor = useMemo(
    () => withHtml(withReact(withHistory(createEditor()))),
    []
  )
  return (
    <Slate editor={editor} defaultValue={initialValue}>
      <Editable
        renderElement={renderElement}
        renderMark={renderMark}
        placeholder="Paste in some HTML..."
      />
    </Slate>
  )
}

const withHtml = editor => {
  const { exec, isInline, isVoid } = editor

  editor.isInline = element => {
    return element.type === 'link' ? true : isInline(element)
  }

  editor.isVoid = element => {
    return element.type === 'image' ? true : isVoid(element)
  }

  editor.exec = command => {
    if (command.type === 'insert_data') {
      const { data } = command
      const html = data.getData('text/html')

      if (html) {
        const parsed = new DOMParser().parseFromString(html, 'text/html')
        const fragment = deserialize(parsed.body)
        Editor.insertFragment(editor, fragment)
        return
      }
    }

    exec(command)
  }

  return editor
}

const Element = props => {
  const { attributes, children, element } = props

  switch (element.type) {
    default:
      return <p {...attributes}>{children}</p>
    case 'quote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'code':
      return (
        <pre>
          <code {...attributes}>{children}</code>
        </pre>
      )
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
    case 'numbered-list':
      return <ol {...attributes}>{children}</ol>
    case 'link':
      return (
        <a href={element.url} {...attributes}>
          {children}
        </a>
      )
    case 'image':
      return <ImageElement {...props} />
  }
}

const ImageElement = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div {...attributes}>
      {children}
      <img
        src={element.url}
        className={css`
          display: block;
          max-width: 100%;
          max-height: 20em;
          box-shadow: ${selected && focused ? '0 0 0 2px blue;' : 'none'};
        `}
      />
    </div>
  )
}

const Mark = ({ attributes, children, mark }) => {
  switch (mark.type) {
    case 'bold':
      return <strong {...attributes}>{children}</strong>
    case 'code':
      return <code {...attributes}>{children}</code>
    case 'italic':
      return <em {...attributes}>{children}</em>
    case 'underlined':
      return <u {...attributes}>{children}</u>
    case 'strikethrough':
      return <del {...attributes}>{children}</del>
  }
}

const initialValue = [
  {
    children: [
      {
        text:
          "By default, pasting content into a Slate editor will use the clipboard's ",
        marks: [],
      },
      {
        text: "'text/plain'",
        marks: [{ type: 'code' }],
      },
      {
        text:
          " data. That's okay for some use cases, but sometimes you want users to be able to paste in content and have it maintaing its formatting. To do this, your editor needs to handle ",
        marks: [],
      },
      {
        text: "'text/html'",
        marks: [{ type: 'code' }],
      },
      {
        text: ' data. ',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text: 'This is an example of doing exactly that!',
        marks: [],
      },
    ],
  },
  {
    children: [
      {
        text:
          "Try it out for yourself! Copy and paste some rendered HTML rich text content (not the source code) from another site into this editor and it's formatting should be preserved.",
        marks: [],
      },
    ],
  },
]

export default PasteHtmlExample
