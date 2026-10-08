import React from 'react'
import { createEditor, Editor, Transforms } from 'slate'
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
    expect(data['text/plain']).toBe('before\n\n\nafter\n')
  })
})
