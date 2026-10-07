import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, Slate, withReact } from '../src'

const initialValue: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'hello' }] } as Descendant,
]

const App = ({ editor }: { editor: ReturnType<typeof withReact> }) => (
  <Slate editor={editor} initialValue={initialValue}>
    <Editable />
  </Slate>
)

describe('Slate initialValue', () => {
  test('initializes a new editor passed to an already mounted Slate', () => {
    const first = withReact(createEditor())
    const second = withReact(createEditor())
    let rerender: ReturnType<typeof render>['rerender']

    act(() => {
      ;({ rerender } = render(<App editor={first} />))
    })
    act(() => {
      rerender(<App editor={second} />)
    })

    expect(second.children).toEqual(initialValue)
  })

  test('does not reset the same editor on rerender', () => {
    const editor = withReact(createEditor())
    let rerender: ReturnType<typeof render>['rerender']

    act(() => {
      ;({ rerender } = render(<App editor={editor} />))
    })
    act(() => {
      Transforms.insertText(editor, ' world', {
        at: { path: [0, 0], offset: 5 },
      })
    })
    act(() => {
      rerender(<App editor={editor} />)
    })

    expect(editor.children).toEqual([
      { type: 'paragraph', children: [{ text: 'hello world' }] },
    ])
  })

  test('resets the editor when Slate remounts', () => {
    const editor = withReact(createEditor())
    let rerender: ReturnType<typeof render>['rerender']

    act(() => {
      ;({ rerender } = render(
        <Slate key="a" editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      ))
    })
    act(() => {
      Transforms.insertText(editor, '!', { at: { path: [0, 0], offset: 5 } })
    })
    act(() => {
      rerender(
        <Slate key="b" editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
    })

    expect(editor.children).toEqual(initialValue)
  })
})
