import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { createEditor, Element } from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'

const chunks = [
  'External ',
  'text ',
  'can ',
  'arrive ',
  'while ',
  'you ',
  'keep ',
  'typing ',
  'in ',
  'another ',
  'block.',
]
const createStreamBlock = text => ({
  type: 'paragraph',
  streamOutput: true,
  children: [{ text }],
})
const isStreamBlock = node =>
  Element.isElement(node) &&
  'streamOutput' in node &&
  node.streamOutput === true
const initialValue = [
  { type: 'paragraph', children: [{ text: 'Type here: ' }] },
  createStreamBlock('Stream output will appear here.'),
]
const withStreamOutsideHistory = editor => {
  const { setChildren } = editor
  editor.setChildren = children =>
    HistoryEditor.withoutSaving(editor, () => setChildren(children))
  return editor
}

const ControlledValueExample = () => {
  const editor = useMemo(
    () => withStreamOutsideHistory(withReact(withHistory(createEditor()))),
    []
  )
  const [value, setValue] = useState(initialValue)
  const [streaming, setStreaming] = useState(false)
  const [complete, setComplete] = useState(false)
  const timer = useRef(null)
  const updateTypedBlocks = useCallback(next => {
    setValue(current => {
      const output = current[current.length - 1]
      if (next[next.length - 1] === output) return next
      const input = next.filter(node => !isStreamBlock(node))
      if (!input.length)
        input.push({ type: 'paragraph', children: [{ text: '' }] })
      return [...input, output]
    })
  }, [])
  useEffect(
    () => () => {
      if (timer.current) clearInterval(timer.current)
    },
    []
  )
  const start = () => {
    setStreaming(true)
    setComplete(false)
    let index = 0
    let text = ''
    timer.current = setInterval(() => {
      text += chunks[index++]
      const streamed = text
      setValue(current => [
        ...current.slice(0, -1),
        createStreamBlock(streamed),
      ])
      if (index === chunks.length) {
        clearInterval(timer.current)
        timer.current = null
        setStreaming(false)
        setComplete(true)
      }
    }, 100)
  }
  return (
    <>
      <p>
        Type in the first paragraph while external text streams into the second.
        Undo keeps the streamed text and removes your typing.
      </p>
      <button
        type="button"
        disabled={streaming}
        onMouseDown={event => event.preventDefault()}
        onClick={start}
      >
        Start stream
      </button>
      <output aria-live="polite">
        {streaming ? 'Streaming' : complete ? 'Complete' : 'Ready'}
      </output>
      <Slate editor={editor} value={value} onValueChange={updateTypedBlocks}>
        <Editable aria-label="Controlled editor" placeholder="Type here..." />
      </Slate>
    </>
  )
}
export default ControlledValueExample
