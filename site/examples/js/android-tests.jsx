import React, { useCallback, useEffect, useMemo, useState } from 'react'
import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { Editable, Slate, withReact } from 'slate-react'
import { css } from '@emotion/css'

const TEST_CASES = [
  {
    id: 'split-join',
    name: 'Split/Join',
    instructions:
      'Hit enter twice then backspace twice in the following places:\n- Before "before"\n- Between the two "d"s in "middle"\n- After "after"',
    value: [
      {
        type: 'paragraph',
        children: [
          { text: 'One ' },
          { text: 'before', bold: true },
          { text: ' two ' },
          { text: 'middle', bold: true },
          { text: ' three ' },
          { text: 'after', bold: true },
          { text: ' four' },
        ],
      },
    ],
  },
  {
    id: 'insert',
    name: 'Insertion',
    instructions:
      'Enter text below each line of instruction, including mis-spelling "wasnt"',
    value: [
      {
        type: 'paragraph',
        children: [
          { text: 'Type by tapping keys: ', bold: true },
          { text: 'It wasnt me. No.' },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Type using glide typing: ', bold: true },
          { text: 'Yes Sam, I am.' },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Type using voice input: ', bold: true },
          { text: 'The quick brown fox jumps over the lazy dog' },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
      {
        type: 'paragraph',
        children: [{ text: 'Write any two words using an IME', bold: true }],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
  {
    id: 'special',
    name: 'Special',
    instructions: 'Follow the instructions on each line',
    value: [
      {
        type: 'paragraph',
        children: [
          {
            text: 'Type "it is", move cursor to "i|t" and hit enter.',
            bold: true,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Move cursor to "mid|dle" and press space, backspace, space, backspace.',
            bold: true,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: 'The middle word.' }],
      },
      {
        type: 'paragraph',
        children: [
          {
            text: 'Place cursor in line below. Wait for caps on keyboard to show up. If not try again. Type "It me. No." and check it doesn\'t mangle on the last period.',
            bold: true,
          },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
  {
    id: 'empty',
    name: 'Empty',
    instructions:
      'Type "hello world", press enter, "hi", press enter, "bye", and then backspace over everything',
    value: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
  {
    id: 'remove',
    name: 'Remove',
    instructions:
      'Select from ANCHOR to FOCUS and press backspace. Move cursor to end. Backspace over all remaining content.',
    value: [
      {
        type: 'paragraph',
        children: [
          { text: 'Go and ' },
          { text: 'select', bold: true },
          { text: ' from this ANCHOR and then' },
        ],
      },
      {
        type: 'paragraph',
        children: [{ text: 'go and select' }],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'to this FOCUS then press ' },
          { text: 'backspace.', bold: true },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'After you have done that move selection to very end.' },
        ],
      },
      {
        type: 'paragraph',
        children: [
          { text: 'Then try ' },
          { text: 'backspacing', bold: true },
          { text: ' over all remaining text.' },
        ],
      },
    ],
  },
  {
    id: 'autocorrect',
    name: 'Autocorrect',
    instructions:
      'Type "Cant", then press space to autocorrect it. Make sure the cursor position is correct (after the autocorrected word)',
    value: [
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ],
  },
]
const AndroidTestsExample = () => {
  const [testId, setTestId] = useState(
    () => window.location.hash.replace('#', '') || TEST_CASES[0].id
  )
  useEffect(() => {
    window.history.replaceState({}, '', `#${testId}`)
  }, [testId])
  const testCase = TEST_CASES.find(({ id }) => id === testId)
  if (!testCase) {
    throw new Error(`Could not find test case '${testId}'`)
  }
  return (
    <>
      <label>
        Test case:{' '}
        <select value={testId} onChange={e => setTestId(e.target.value)}>
          {TEST_CASES.map(({ name, id }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
        </select>
      </label>

      <p
        className={css`
          font-weight: 600;
          margin: 0.5rem 0;
          white-space: pre-line;
        `}
      >
        {testCase.instructions}
      </p>

      <TestCase key={testId} {...testCase} />
    </>
  )
}
const TestCase = ({ value }) => {
  const renderLeaf = useCallback(props => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  return (
    <Slate editor={editor} initialValue={value}>
      <Editable
        renderLeaf={renderLeaf}
        placeholder="Enter some text…"
        spellCheck
      />
    </Slate>
  )
}
const Leaf = ({ attributes, children, leaf }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }
  return <span {...attributes}>{children}</span>
}
export default AndroidTestsExample
