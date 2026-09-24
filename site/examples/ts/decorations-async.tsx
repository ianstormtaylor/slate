import { css } from '@emotion/css'
import React, { useCallback, useEffect, useRef, useState, useMemo } from 'react'
import { Descendant, Text, NodeEntry, Range, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import {
  Editable,
  RenderLeafProps,
  Slate,
  withReact,
  ReactEditor,
} from 'slate-react'

// Finds all words that appear more than once across the document and returns
// their ranges. In a real app this work might come from a language server,
// spell-checker, or search index — anything that produces results with latency.
function findDuplicateRanges(editor: ReactEditor): Range[] {
  const freq: Record<string, number> = {}

  for (const [node] of editor.nodes({ at: [], match: n => Text.isText(n) })) {
    if (!Text.isText(node)) continue
    for (const word of node.text.toLowerCase().match(/\b\w+\b/g) ?? []) {
      freq[word] = (freq[word] ?? 0) + 1
    }
  }

  const duplicates = new Set(Object.keys(freq).filter(w => freq[w] > 1))
  const ranges: Range[] = []

  for (const [node, path] of editor.nodes({
    at: [],
    match: n => Text.isText(n),
  })) {
    if (!Text.isText(node)) continue
    const wordRe = /\b\w+\b/g
    let match: RegExpExecArray | null
    while ((match = wordRe.exec(node.text)) !== null) {
      if (duplicates.has(match[0].toLowerCase())) {
        ranges.push({
          anchor: { path, offset: match.index },
          focus: { path, offset: match.index + match[0].length },
        })
      }
    }
  }

  return ranges
}

const AsyncDecorationsExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  const [ranges, setRanges] = useState<Range[]>([])
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Compute the initial decorations synchronously on mount.
  useEffect(() => {
    setRanges(findDuplicateRanges(editor))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current)
    }
  }, [])

  // On every change, keep the existing ranges and schedule a recompute after
  // 600 ms. When the timeout fires, `setRanges` produces a new `ranges`
  // reference, which gives `decorate` a new identity and triggers a full
  // re-decoration pass across all Text components — the scenario where the
  // caret previously jumped.
  const handleChange = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => {
      setRanges(findDuplicateRanges(editor))
    }, 600)
  }, [editor])

  const decorate = useCallback(
    ([node, path]: NodeEntry): Range[] => {
      if (!Text.isText(node)) return []
      return ranges
        .filter(r => r.anchor.path[0] === path[0])
        .map(r => ({ ...r, highlight: true }))
    },
    [ranges]
  )

  return (
    <div>
      <p
        className={css`
          font-size: 0.85em;
          color: #555;
          margin-bottom: 8px;
          padding: 8px 12px;
          background: #fffbe6;
          border: 1px solid #ffe58f;
          border-radius: 4px;
        `}
      >
        Words that appear <strong>more than once</strong> are highlighted.
        Highlights are kept while you type and updated{' '}
        <strong>600 ms after you stop</strong>, simulating an async source such
        as a spell-checker or language server. Place the caret after the text
        and type a word that already exists — the caret should stay put when the
        new highlight appears.
      </p>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={handleChange}
      >
        <Editable
          decorate={decorate}
          renderLeaf={(props: RenderLeafProps) => <Leaf {...props} />}
          className={css`
            min-height: 140px;
            padding: 12px;
            border: 1px solid #ddd;
            border-radius: 4px;
            font-size: 16px;
            line-height: 1.6;
          `}
        />
      </Slate>
    </div>
  )
}

interface HighlightLeaf {
  highlight?: boolean
  text: string
}

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
  const hLeaf = leaf as HighlightLeaf
  return (
    <span
      {...attributes}
      {...(hLeaf.highlight && { 'data-cy': 'highlight' })}
      className={css`
        background-color: ${hLeaf.highlight ? '#ffe58f' : 'transparent'};
        border-radius: ${hLeaf.highlight ? '2px' : '0'};
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
        text: 'The fox jumped over the fence and the fox ran away.',
      },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text: 'Type a word that already appears above, then wait. The new occurrence will be highlighted after a short delay.',
      },
    ],
  },
]

export default AsyncDecorationsExample
