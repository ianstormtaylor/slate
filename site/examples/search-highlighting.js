import React, { useCallback, useMemo, useState } from 'react'
import { Editable, Slate, withReact } from 'slate-react'
import { createEditor, Element, Node } from 'slate'
import { css } from 'emotion'
import { withHistory } from 'slate-history'
import escapeRegExp from 'lodash/escapeRegExp'

import { Icon, Toolbar } from '../components'

const SearchHighlightingExample = () => {
  const [value, setValue] = useState(initialValue)
  const [search, setSearch] = useState()
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []

      if (search && Element.isElement(node)) {
        const searchRegex = new RegExp(`${escapeRegExp(search)}`, 'gi')
        const text = Node.string(node)
        for (const match of text.matchAll(searchRegex)) {
          const start = match.index
          const end = match.index + match[0].length

          let offset = 0
          let anchor
          let focus
          node.children.forEach((childNode, index) => {
            const childPath = [path[0], index]
            if (
              offset + childNode.text.length > start &&
              anchor === undefined
            ) {
              anchor = { path: childPath, offset: start - offset }
            }

            if (offset + childNode.text.length >= end && focus === undefined) {
              focus = { path: childPath, offset: end - offset }
            }

            offset += childNode.text.length
          })
          ranges.push({
            anchor,
            focus,
            highlight: true,
          })
        }
      }

      return ranges
    },
    [search]
  )

  const renderLeaf = useCallback(props => <Leaf {...props} />, [decorate])

  return (
    <Slate editor={editor} value={value} onChange={value => setValue(value)}>
      <Toolbar>
        <div
          className={css`
            position: relative;
          `}
        >
          <Icon
            className={css`
              position: absolute;
              top: 0.5em;
              left: 0.5em;
              color: #ccc;
            `}
          >
            search
          </Icon>
          <input
            type="search"
            placeholder="Search the text..."
            onChange={e => setSearch(e.target.value)}
            className={css`
              padding-left: 2em;
              width: 100%;
            `}
          />
        </div>
      </Toolbar>
      <Editable decorate={decorate} renderLeaf={renderLeaf} />
    </Slate>
  )
}

const Leaf = ({ attributes, children, leaf }) => {
  return (
    <span
      {...attributes}
      className={css`
        font-weight: ${leaf.bold && 'bold'};
        background-color: ${leaf.highlight && '#ffeeba'};
      `}
    >
      {children}
    </span>
  )
}

const initialValue = [
  {
    children: [
      {
        text:
          'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations', bold: true },
      { text: ' to them in realtime.' },
    ],
  },
  {
    children: [
      { text: 'Try it out for yourself by typing in the search box above!' },
    ],
  },
]

export default SearchHighlightingExample
