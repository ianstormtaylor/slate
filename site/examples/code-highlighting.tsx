import Prism from 'prismjs'
import 'prismjs/components/prism-javascript'
import 'prismjs/components/prism-jsx'
import 'prismjs/components/prism-typescript'
import 'prismjs/components/prism-tsx'
import 'prismjs/components/prism-markdown'
import 'prismjs/components/prism-python'
import 'prismjs/components/prism-php'
import 'prismjs/components/prism-sql'
import 'prismjs/components/prism-java'
import React, { useCallback, useState } from 'react'
import {
  createEditor,
  Node,
  Editor,
  Range,
  Element,
  Transforms,
  Point,
} from 'slate'
import {
  withReact,
  Slate,
  Editable,
  RenderElementProps,
  RenderLeafProps,
  useSlate,
  ReactEditor,
  useSlateStatic,
} from 'slate-react'
import { withHistory } from 'slate-history'
import isHotkey from 'is-hotkey'
import { css } from '@emotion/css'

import { ParagraphElement, CodeLineElement } from './custom-types'

const ParagraphType = 'paragraph'
const CodeLineType = 'code-line'

const renderElement = (props: RenderElementProps) => {
  const { attributes, children, element } = props
  const editor = useSlateStatic()
  const Tag = editor.isInline(element) ? 'span' : 'div'
  const attrs = {
    'data-slate-element-type': element.type,
  }

  if (element.type === CodeLineType) {
    const intervalsStarts =
      editor.intervalsStarts.get(CodeLineType) || new Set()
    const path = ReactEditor.findPath(editor, element)
    const selectVisible = intervalsStarts.has(path[0])

    const setLanguage = (language: string) => {
      const intervals = editor.intervals.get(CodeLineType) || []
      const interval = intervals.find(
        ([start, end]) => start <= path[0] && end >= path[0]
      )
      if (interval) {
        Transforms.setNodes(
          editor,
          { language },
          {
            at: {
              anchor: Editor.start(editor, [interval[0]]),
              focus: Editor.end(editor, [interval[1]]),
            },
          }
        )
      }
    }

    return (
      <Tag
        {...attributes}
        {...attrs}
        style={{ position: 'relative' }}
        className={
          element.type === CodeLineType &&
          css(`
        font-family: monospace;
        font-size: 16px;
        line-height: 20px;
        margin-top: 0;
        background: rgba(0, 20, 60, .03);
        padding: 5px 13px;
      `)
        }
        spellCheck={element.type !== CodeLineType}
      >
        {selectVisible && (
          <LanguageSelect
            value={element.language}
            onChange={e => setLanguage(e.target.value)}
          />
        )}
        {children}
      </Tag>
    )
  }

  return (
    <Tag {...attributes} {...attrs} style={{ position: 'relative' }}>
      {children}
    </Tag>
  )
}

const renderLeaf = (props: RenderLeafProps) => {
  const { attributes, children, leaf } = props
  const { text, ...rest } = leaf

  return (
    <span {...attributes} className={Object.keys(rest).join(' ')}>
      {children}
    </span>
  )
}

const useDecorate = (editor: Editor) => {
  return useCallback(([_, path]) => {
    if (path.length !== 1) {
      // skip not top level elements
      return []
    }

    // find ranges for element by id
    const element = editor.children[path[0]]
    const id = ReactEditor.findKey(editor, element).id
    const ranges = editor.ranges.get(id)

    return ranges ? ranges.slice() : []
  }, [])
}

// set editor.intervals with intervals of a continuous stream of identical elements
// set editor.intervalsStarts with set of these intervals start index (for optimization)
const ExtractIntervals = () => {
  const editor = useSlate()
  const children = editor.children

  const intervals = new Map<string, [number, number][]>()
  const intervalsStarts = new Map<string, Set<number>>()
  let prev = null
  // the loop has children.length + 1 iterations in order to close the last interval
  for (let i = 0; i < children.length + 1; i++) {
    const element = children[i] as Element

    if (!prev || !element || prev.type !== element.type) {
      if (prev) {
        // update the end of an interval
        intervals.get(prev.type).slice(-1)[0][1] = i - 1
      }

      if (element) {
        if (!intervals.has(element.type)) {
          intervals.set(element.type, [])
        }
        // push the start of an interval
        intervals.get(element.type).push([i, 0])

        if (!intervalsStarts.has(element.type)) {
          intervalsStarts.set(element.type, new Set())
        }
        intervalsStarts.get(element.type).add(i)
      }
    }

    prev = element
  }

  editor.intervals = intervals
  editor.intervalsStarts = intervalsStarts

  return null
}

class PrismTokenNode {
  token: string | Prism.Token
  parent: null | PrismTokenNode

  constructor(token: string | Prism.Token, parent: null | PrismTokenNode) {
    this.token = token
    this.parent = parent
  }
}

// set editor.ranges with decorations to use them in decorate function then
const ExtractRanges = () => {
  const editor = useSlate()

  const ranges = new Map<string, Range[]>()

  const intervals = editor.intervals.get(CodeLineType) || [] // work only with code line intervals
  for (const interval of intervals) {
    const firstElement = editor.children[interval[0]] as CodeLineElement
    const language = firstElement.language

    const text = editor.children
      .slice(interval[0], interval[1] + 1)
      .map(element => Node.string(element))
      .join('\n')
    const tokens = Prism.tokenize(text, Prism.languages[language])

    const stack: PrismTokenNode[] = []

    // fill initial stack with reversed tokens
    for (let i = tokens.length - 1; i >= 0; i--) {
      stack.push(new PrismTokenNode(tokens[i], null))
    }

    let startOffset = 0
    let index = interval[0]
    while (stack.length) {
      const currentTokenNode = stack.pop()!
      const token = currentTokenNode.token
      const length = token.length

      if (typeof token !== 'string' && Array.isArray(token.content)) {
        // add reversed content (children) tokens to stack
        for (let i = token.content.length - 1; i >= 0; i--) {
          stack.push(new PrismTokenNode(token.content[i], currentTokenNode))
        }
        continue
      }

      // split string into lines to be sure that there are no multiline tokens
      const str = typeof token === 'string' ? token : (token.content as string)
      if (str !== '\n') {
        const lines = str.split(/(\n)/)
        if (lines.length > 1) {
          // if it is multiline token split it add it back to stack each line separately in reversed order
          for (let i = lines.length - 1; i >= 0; i--) {
            const line = lines[i]

            stack.push(
              new PrismTokenNode(
                typeof token === 'string'
                  ? line
                  : new Prism.Token(token.type, line, token.alias, line),
                currentTokenNode
              )
            )
          }
          continue
        }
      } else {
        // if it is line break reset startOffset and increment index
        index++
        startOffset = 0
        continue
      }

      // calculate endOffset
      const endOffset = startOffset + length

      // create types set based on token's and all ancestors' types
      const types = new Set<string>(['token'])
      let tokenNodeCursor = currentTokenNode
      while (tokenNodeCursor) {
        const { token } = tokenNodeCursor

        if (typeof token !== 'string') {
          const type = token.type
          const aliasArray = Array.isArray(token.alias)
            ? token.alias
            : [token.alias]

          const isTag = type === 'tag' || aliasArray.includes('tag')

          if (types.has('script') && isTag) {
            // skip "tag" type and following, if types already has "script" type
            // matters for correct jsx, tsx attributes highlighting
            break
          }

          types.add(type)

          for (const alias of aliasArray) {
            alias && types.add(alias)
          }
        }

        tokenNodeCursor = tokenNodeCursor.parent
      }

      // fill ranges map for decorate function
      if (types.size) {
        const key = ReactEditor.findKey(editor, editor.children[index])
        if (!ranges.has(key.id)) {
          ranges.set(key.id, [])
        }

        const anchor: Point = {
          basePath: [index, 0],
          path: [],
          offset: startOffset,
        }
        const focus: Point = {
          basePath: [index, 0],
          path: [],
          offset: endOffset,
        }

        const range: Range = { anchor, focus }

        for (const type of types) {
          range[type] = true
        }

        ranges.get(key.id)!.push(range)
      }

      // move startOffset to end
      startOffset = endOffset
    }
  }

  editor.ranges = ranges

  return null
}

const useOnKeydown = (editor: Editor) => {
  const onKeyDown: React.KeyboardEventHandler = useCallback(e => {
    if (isHotkey('tab', e)) {
      // handle tab key, insert spaces
      e.preventDefault()

      Editor.insertText(editor, '  ')
    }
  }, [])

  return onKeyDown
}

const LanguageSelect = (props: JSX.IntrinsicElements['select']) => {
  return (
    <select contentEditable={false} style={{ float: 'right' }} {...props}>
      <option value="css">CSS</option>
      <option value="html">HTML</option>
      <option value="java">Java</option>
      <option value="javascript">JavaScript</option>
      <option value="jsx">JSX</option>
      <option value="markdown">Markdown</option>
      <option value="php">PHP</option>
      <option value="python">Python</option>
      <option value="sql">SQL</option>
      <option value="tsx">TSX</option>
      <option value="typescript">TypeScript</option>
    </select>
  )
}

const CodeHighlightingExample = () => {
  const [editor] = useState(() => withHistory(withReact(createEditor())))

  const decorate = useDecorate(editor)
  const onKeyDown = useOnKeydown(editor)

  return (
    <Slate editor={editor} value={initialValue}>
      <ExtractIntervals />
      <ExtractRanges />
      <Editable
        decorate={decorate}
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={onKeyDown}
      />
      <style>{prismThemeCss}</style>
    </Slate>
  )
}

// Initial content lines stored in content property, because it is easier to test/change it
type ToLine<TElement> = Omit<TElement & { content: string }, 'children'>
type Line = ToLine<ParagraphElement> | ToLine<CodeLineElement>

const initialValueLines: Line[] = [
  {
    type: ParagraphType,
    content:
      "Here's one containing a single paragraph block with some text in it:",
  },
  {
    type: CodeLineType,
    language: 'jsx',
    content: `// Add the initial value.
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'A line of text in a paragraph.' }]
  }
]

const App = () => {
  const [editor] = useState(() => withReact(createEditor()))

  return (
    <Slate editor={editor} value={initialValue}>
      <Editable />
    </Slate>
  )
}`,
  },
  {
    type: ParagraphType,
    content:
      'If you are using TypeScript, you will also need to extend the Editor with ReactEditor and add annotations as per the documentation on TypeScript. The example below also includes the custom types required for the rest of this example.',
  },
  {
    type: CodeLineType,
    language: 'typescript',
    content: `// TypeScript users only add this code
import { BaseEditor, Descendant } from 'slate'
import { ReactEditor } from 'slate-react'

type CustomElement = { type: 'paragraph'; children: CustomText[] }
type CustomText = { text: string }

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor
    Element: CustomElement
    Text: CustomText
  }
}`,
  },
]

const initialValue = []
for (const line of initialValueLines) {
  const { content, ...rest } = line

  for (const line of content.split('\n')) {
    initialValue.push({
      ...rest,
      children: [{ text: line }],
    })
  }
}

// Prismjs theme stored as a string instead of emotion css function.
// It is useful for copy/pasting different themes. Also lets keeping simpler Leaf implementation
const prismThemeCss = `
/**
 * prism.js default theme for JavaScript, CSS and HTML
 * Based on dabblet (http://dabblet.com)
 * @author Lea Verou
 */

code[class*="language-"],
pre[class*="language-"] {
    color: black;
    background: none;
    text-shadow: 0 1px white;
    font-family: Consolas, Monaco, 'Andale Mono', 'Ubuntu Mono', monospace;
    font-size: 1em;
    text-align: left;
    white-space: pre;
    word-spacing: normal;
    word-break: normal;
    word-wrap: normal;
    line-height: 1.5;

    -moz-tab-size: 4;
    -o-tab-size: 4;
    tab-size: 4;

    -webkit-hyphens: none;
    -moz-hyphens: none;
    -ms-hyphens: none;
    hyphens: none;
}

pre[class*="language-"]::-moz-selection, pre[class*="language-"] ::-moz-selection,
code[class*="language-"]::-moz-selection, code[class*="language-"] ::-moz-selection {
    text-shadow: none;
    background: #b3d4fc;
}

pre[class*="language-"]::selection, pre[class*="language-"] ::selection,
code[class*="language-"]::selection, code[class*="language-"] ::selection {
    text-shadow: none;
    background: #b3d4fc;
}

@media print {
    code[class*="language-"],
    pre[class*="language-"] {
        text-shadow: none;
    }
}

/* Code blocks */
pre[class*="language-"] {
    padding: 1em;
    margin: .5em 0;
    overflow: auto;
}

:not(pre) > code[class*="language-"],
pre[class*="language-"] {
    background: #f5f2f0;
}

/* Inline code */
:not(pre) > code[class*="language-"] {
    padding: .1em;
    border-radius: .3em;
    white-space: normal;
}

.token.comment,
.token.prolog,
.token.doctype,
.token.cdata {
    color: slategray;
}

.token.punctuation {
    color: #999;
}

.token.namespace {
    opacity: .7;
}

.token.property,
.token.tag,
.token.boolean,
.token.number,
.token.constant,
.token.symbol,
.token.deleted {
    color: #905;
}

.token.selector,
.token.attr-name,
.token.string,
.token.char,
.token.builtin,
.token.inserted {
    color: #690;
}

.token.operator,
.token.entity,
.token.url,
.language-css .token.string,
.style .token.string {
    color: #9a6e3a;
    /* This background color was intended by the author of this theme. */
    background: hsla(0, 0%, 100%, .5);
}

.token.atrule,
.token.attr-value,
.token.keyword {
    color: #07a;
}

.token.function,
.token.class-name {
    color: #DD4A68;
}

.token.regex,
.token.important,
.token.variable {
    color: #e90;
}

.token.important,
.token.bold {
    font-weight: bold;
}
.token.italic {
    font-style: italic;
}

.token.entity {
    cursor: help;
}
`

export default CodeHighlightingExample
