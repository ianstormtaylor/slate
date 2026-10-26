import { css } from '@emotion/css'
import React, { useCallback, useMemo, useState } from 'react'
import remarkParse from 'remark-parse'
import remarkStringify from 'remark-stringify'
import {
  remarkToSlate,
  slateToRemark,
  withMdast,
} from 'remark-slate-transformer'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { unified } from 'unified'

const parser = unified().use(remarkParse).use(remarkToSlate)
const serializer = unified().use(remarkStringify)
const emptyDocument = [{ type: 'paragraph', children: [{ text: '' }] }]
const toSlate = markdown => {
  const value = parser.processSync(markdown).result
  return value.length ? value : emptyDocument
}
const toMarkdown = value => serializer.stringify(slateToRemark(value))
const initialMarkdown = `# Markdown sync

Edit either side. The editor and the Markdown stay in step, with **strong**, *emphasis* and \`inline code\` marks.

* Lists keep their items
* Enter in a list item starts a new one

> Links like [Slate](https://docs.slatejs.org) stay inline.

\`\`\`
Code blocks keep their text.
\`\`\`
`
const MarkdownSyncExample = () => {
  const editor = useMemo(
    () => withMdast(withHistory(withReact(createEditor()))),
    []
  )
  const [markdown, setMarkdown] = useState(initialMarkdown)
  const [value, setValue] = useState(() => toSlate(initialMarkdown))
  const renderElement = useCallback(props => <Element {...props} />, [])
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editValue = useCallback(next => {
    setValue(next)
    setMarkdown(toMarkdown(next))
  }, [])
  const editMarkdown = text => {
    setMarkdown(text)
    setValue(toSlate(text))
  }
  return (
    <div
      className={css`
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 16px;
        @media (max-width: 640px) {
          grid-template-columns: 1fr;
        }
      `}
    >
      <Slate editor={editor} value={value} onValueChange={editValue}>
        <Editable
          aria-label="Rich text editor"
          renderElement={renderElement}
          renderLeaf={renderLeaf}
        />
      </Slate>
      <textarea
        aria-label="Markdown"
        value={markdown}
        onChange={event => editMarkdown(event.target.value)}
        spellCheck={false}
        className={css`
          min-height: 320px;
          font-family: monospace;
          font-size: 14px;
          padding: 8px;
          resize: vertical;
        `}
      />
    </div>
  )
}
const Element = ({ attributes, children, element }) => {
  const node = element
  switch (node.type) {
    case 'heading': {
      const Heading = `h${node.depth}`
      return <Heading {...attributes}>{children}</Heading>
    }
    case 'blockquote':
      return <blockquote {...attributes}>{children}</blockquote>
    case 'list':
      return node.ordered ? (
        <ol {...attributes} start={node.start ?? undefined}>
          {children}
        </ol>
      ) : (
        <ul {...attributes}>{children}</ul>
      )
    case 'listItem':
      return <li {...attributes}>{children}</li>
    case 'code':
      return (
        <pre {...attributes}>
          <code>{children}</code>
        </pre>
      )
    case 'html':
      return node.inline ? (
        <code {...attributes}>{children}</code>
      ) : (
        <pre {...attributes}>{children}</pre>
      )
    case 'link':
      return (
        <a {...attributes} href={node.url}>
          {children}
        </a>
      )
    case 'image':
      return (
        <span {...attributes}>
          <img
            contentEditable={false}
            src={node.url}
            alt={node.alt ?? ''}
            className={css`
              max-width: 100%;
            `}
          />
          {children}
        </span>
      )
    case 'break':
      return (
        <span {...attributes}>
          <br contentEditable={false} />
          {children}
        </span>
      )
    case 'thematicBreak':
      return (
        <div {...attributes}>
          <hr contentEditable={false} />
          {children}
        </div>
      )
    default:
      return <p {...attributes}>{children}</p>
  }
}
const Leaf = ({ attributes, children, leaf }) => {
  const text = leaf
  if (text.inlineCode) children = <code>{children}</code>
  if (text.strong) children = <strong>{children}</strong>
  if (text.emphasis) children = <em>{children}</em>
  if (text.delete) children = <del>{children}</del>
  return <span {...attributes}>{children}</span>
}
export default MarkdownSyncExample
