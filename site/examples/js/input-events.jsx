import { css } from '@emotion/css'
import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { Node, Range, createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, withReact } from 'slate-react'

const MAX_ENTRIES = 500
const LOGGED_EVENTS = [
  'keydown',
  'beforeinput',
  'input',
  'compositionstart',
  'compositionupdate',
  'compositionend',
]
const formatPoint = point => `${point.path.join('.')}:${point.offset}`
const formatSelection = editor => {
  const { selection } = editor
  if (!selection) return 'none'
  if (Range.isCollapsed(selection)) return formatPoint(selection.anchor)
  return `${formatPoint(selection.anchor)}-${formatPoint(selection.focus)}`
}
const formatEvent = event => {
  if (event instanceof KeyboardEvent) {
    return `key=${JSON.stringify(event.key)} code=${event.keyCode}`
  }
  if (event instanceof CompositionEvent) {
    return `data=${JSON.stringify(event.data)}`
  }
  if (event instanceof InputEvent) {
    const ranges = event
      .getTargetRanges()
      .map(range => `${range.startOffset}-${range.endOffset}`)
      .join(',')
    return [
      event.inputType,
      JSON.stringify(event.data),
      event.isComposing ? 'composing' : '',
      ranges ? `ranges=${ranges}` : '',
    ]
      .filter(Boolean)
      .join(' ')
  }
  return ''
}
const focusedBlockText = editor =>
  editor.selection
    ? Node.string(Node.get(editor, editor.selection.anchor.path.slice(0, 1)))
    : ''
const InputEventsExample = () => {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [entries, setEntries] = useState([])
  const startRef = useRef(null)
  const logRef = useRef(null)
  const record = useCallback((type, detail) => {
    const now = performance.now()
    startRef.current ??= now
    const elapsed = Math.round(now - startRef.current)
    setEntries(previous =>
      [...previous, `+${elapsed}ms ${type} ${detail}`].slice(-MAX_ENTRIES)
    )
  }, [])
  useEffect(() => {
    const root = ReactEditor.toDOMNode(editor, editor)
    const listener = event =>
      record(
        event.type,
        `${formatEvent(event)} sel=${formatSelection(editor)}`.trim()
      )
    LOGGED_EVENTS.forEach(type => root.addEventListener(type, listener, true))
    return () =>
      LOGGED_EVENTS.forEach(type =>
        root.removeEventListener(type, listener, true)
      )
  }, [editor, record])
  const renderElement = useCallback(
    ({ attributes, children, element }) =>
      element.type === 'block-quote' ? (
        <blockquote {...attributes}>{children}</blockquote>
      ) : (
        <p {...attributes}>{children}</p>
      ),
    []
  )
  const log = [`userAgent ${navigator.userAgent}`, ...entries].join('\n')
  const copyLog = () => {
    const select = () => logRef.current?.select()
    if (!navigator.clipboard) return select()
    navigator.clipboard.writeText(log).catch(select)
  }
  return (
    <div>
      <p>
        Reproduce the bug in the editor, then copy the log below and paste it
        into the issue with your keyboard app and OS version. Nothing is sent
        anywhere.
      </p>
      <Slate
        editor={editor}
        initialValue={initialValue}
        onChange={() =>
          record(
            'change',
            `${JSON.stringify(focusedBlockText(editor))} sel=${formatSelection(
              editor
            )}`
          )
        }
      >
        <Editable
          aria-label="Input events editor"
          renderElement={renderElement}
          className={css`
            border: 1px solid #ccc;
            padding: 0 8px;
          `}
        />
      </Slate>
      <div
        className={css`
          display: flex;
          gap: 8px;
          margin: 16px 0 8px;
        `}
      >
        <button type="button" onClick={copyLog}>
          Copy log
        </button>
        <button
          type="button"
          onClick={() => {
            startRef.current = null
            setEntries([])
          }}
        >
          Clear log
        </button>
      </div>
      <textarea
        ref={logRef}
        aria-label="Input event log"
        readOnly
        value={log}
        className={css`
          width: 100%;
          min-height: 240px;
          font-family: monospace;
          font-size: 12px;
        `}
      />
    </div>
  )
}
const initialValue = [
  {
    type: 'paragraph',
    children: [{ text: 'Type here to log the events your keyboard sends.' }],
  },
  {
    type: 'paragraph',
    children: [{ text: 'A second paragraph, followed by a quote:' }],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
]
export default InputEventsExample
