import { css } from '@emotion/css'
import Prism from 'prismjs'
import 'prismjs/components/prism-markdown'
import React, { useCallback, useMemo } from 'react'
import { Descendant, Node, NodeEntry, Range, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, RenderLeafProps, Slate, withReact } from 'slate-react'
import { CustomEditor } from './custom-types.d'

const markdownGrammar = Prism.languages.extend('markdown', {}) as Record<
  string,
  Prism.GrammarValue
>
const titles = markdownGrammar.title

if (Array.isArray(titles)) {
  for (const title of titles) {
    if (!(title instanceof RegExp)) {
      title.inside = {
        ...title.inside,
        bold: markdownGrammar.bold,
        italic: markdownGrammar.italic,
        'code-snippet': markdownGrammar['code-snippet'],
      }
    }
  }
}

const MarkdownPreviewExample = () => {
  const renderLeaf = useCallback(
    (props: RenderLeafProps) => <Leaf {...props} />,
    []
  )
  const editor = useMemo(
    () => withHistory(withReact(createEditor())) as CustomEditor,
    []
  )
  const decorate = useCallback(([node, path]: NodeEntry) => {
    const ranges: Range[] = []

    if (!Node.isText(node)) {
      return ranges
    }

    const decorateTokens = (
      tokens: Array<string | Prism.Token>,
      offset: number
    ): number => {
      for (const token of tokens) {
        const start = offset

        if (typeof token === 'string') {
          offset += token.length
        } else {
          const content = Array.isArray(token.content)
            ? token.content
            : [token.content]
          offset = decorateTokens(content, offset)
          ranges.push({
            [token.type]: true,
            anchor: { path, offset: start },
            focus: { path, offset },
          })
        }
      }

      return offset
    }

    decorateTokens(Prism.tokenize(node.text, markdownGrammar), 0)

    return ranges
  }, [])

  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Editable
        decorate={decorate}
        renderLeaf={renderLeaf}
        placeholder="Write some markdown..."
      />
    </Slate>
  )
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && 'bold'};
        font-style: ${leaf.italic && 'italic'};
        text-decoration: ${leaf.underlined && 'underline'};
        ${leaf.title &&
        css`
          display: inline-block;
          font-weight: bold;
          font-size: 20px;
          margin: 20px 0 10px 0;
        `}
        ${leaf.list &&
        css`
          padding-left: 10px;
          font-size: 20px;
          line-height: 10px;
        `}
        ${leaf.hr &&
        css`
          display: block;
          text-align: center;
          border-bottom: 2px solid #ddd;
        `}
        ${leaf.blockquote &&
        css`
          display: inline-block;
          border-left: 2px solid #ddd;
          padding-left: 10px;
          color: #aaa;
          font-style: italic;
        `}
        ${leaf.code &&
        css`
          font-family: monospace;
          background-color: #eee;
          padding: 3px;
        `}
      `}
    >
      {children}
    </span>
  )
}

const initialValue: Descendant[] = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'Slate is flexible enough to add **decorations** that can format text based on its content. For example, this editor has **Markdown** preview decorations on it, to make it _dead_ simple to make an editor with built-in Markdown previewing.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [{ text: '## Try it out!' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'Try it out for yourself!' }],
  },
]

export default MarkdownPreviewExample
