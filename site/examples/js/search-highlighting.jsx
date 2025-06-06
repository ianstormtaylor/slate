import { css } from '@emotion/css'
import React, { useCallback, useMemo, useState } from 'react'
import { Element, Text, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { Icon, Toolbar } from './components'

const SearchHighlightingExample = () => {
  const [search, setSearch] = useState('')
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const decorate = useCallback(
    ([node, path]) => {
      const ranges = []
      if (
        search &&
        Element.isElement(node) &&
        Array.isArray(node.children) &&
        node.children.every(Text.isText)
      ) {
        const texts = node.children.map(it => it.text)
        const str = texts.join('')
        const length = search.length
        let start = str.indexOf(search)
        let index = 0
        let iterated = 0
        while (start !== -1) {
          // Skip already iterated strings
          while (
            index < texts.length &&
            start >= iterated + texts[index].length
          ) {
            iterated = iterated + texts[index].length
            index++
          }
          // Find the index of array and relative position
          let offset = start - iterated
          let remaining = length
          while (index < texts.length && remaining > 0) {
            const currentText = texts[index]
            const currentPath = [...path, index]
            const taken = Math.min(remaining, currentText.length - offset)
            ranges.push({
              anchor: { path: currentPath, offset },
              focus: { path: currentPath, offset: offset + taken },
              highlight: true,
            })
            remaining = remaining - taken
            if (remaining > 0) {
              iterated = iterated + currentText.length
              // Next block will be indexed from 0
              offset = 0
              index++
            }
          }
          // Looking for next search block
          start = str.indexOf(search, start + search.length)
        }
      }
      return ranges
    },
    [search]
  )
  return (
    <Slate editor={editor} initialValue={initialValue}>
      <Toolbar>
        <div
          className={css`
            position: relative;
          `}
        >
          <Icon
            className={css`
              position: absolute;
              top: 0.3em;
              left: 0.4em;
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
              padding-left: 2.5em !important;
              width: 100%;
            `}
          />
        </div>
      </Toolbar>
      <Editable decorate={decorate} renderLeaf={props => <Leaf {...props} />} />
    </Slate>
  )
}
const Leaf = ({ attributes, children, leaf }) => {
  const highlightLeaf = leaf
  return (
    <span
      {...attributes}
      {...(highlightLeaf.highlight && { 'data-cy': 'search-highlighted' })}
      className={css`
        font-weight: ${highlightLeaf.bold && 'bold'};
        background-color: ${highlightLeaf.highlight && '#ffeeba'};
      `}
    >
      {children}
    </span>
  )
}
const initialValue = [
  {
    type: 'paragraph',
    children: [
      {
        text: 'This is editable text that you can search. As you search, it looks for matching strings of text, and adds ',
      },
      { text: 'decorations', bold: true },
      { text: ' to them in realtime.' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      { text: 'Try it out for yourself by typing in the search box above!' },
    ],
  },
]
export default SearchHighlightingExample
