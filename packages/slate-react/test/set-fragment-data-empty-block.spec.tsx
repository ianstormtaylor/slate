import React from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { render, act } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

const clipboard = () => {
  const data: Record<string, string> = {}
  return {
    data,
    transfer: {
      setData: (type: string, value: string) => {
        data[type] = value
      },
    } as unknown as DataTransfer,
  }
}

const copyAll = (initialValue: Descendant[]) => {
  const editor = withReact(createEditor())
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )

  act(() => {
    Transforms.select(editor, Editor.range(editor, []))
  })

  const { data, transfer } = clipboard()
  ReactEditor.setFragmentData(editor, transfer)
  return data
}

const lines = (...texts: string[]): Descendant[] =>
  texts.map(text => ({ children: [{ text }] }))

describe('setFragmentData', () => {
  it('keeps an empty block as a line break in the copied HTML', () => {
    const editor = withReact(createEditor())
    render(
      <Slate
        editor={editor}
        initialValue={[
          { children: [{ text: 'before' }] },
          { children: [{ text: '' }] },
          { children: [{ text: 'after' }] },
        ]}
      >
        <Editable />
      </Slate>
    )

    act(() => {
      Transforms.select(editor, Editor.range(editor, []))
    })

    const { data, transfer } = clipboard()
    ReactEditor.setFragmentData(editor, transfer)

    const html = document.createElement('div')
    html.innerHTML = data['text/html']
    const emptyBlock = html.querySelector('[data-slate-zero-width="n"]')
    expect(emptyBlock?.innerHTML).toBe('<br>')
    expect(data['text/plain']).toBe('before\n\nafter\n')
  })

  it('copies one blank line per empty block as plain text', () => {
    expect(copyAll(lines('a', '', '', 'b'))['text/plain']).toBe('a\n\n\nb\n')
  })

  it('keeps a soft line break inside a block', () => {
    expect(copyAll(lines('a\nb'))['text/plain']).toBe('a\nb')
  })
})
