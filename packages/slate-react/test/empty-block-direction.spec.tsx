import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, Slate, withReact } from '../src'

const paragraph = (text: string) =>
  ({ children: [{ text }] }) as unknown as Descendant

const renderEditor = (initialValue: Descendant[]) => {
  const editor = withReact(createEditor())
  const { container } = render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
  const blockDirections = () =>
    Array.from(
      container.querySelectorAll('[data-slate-editor] > [data-slate-node]')
    ).map(block => block.getAttribute('dir'))
  return { editor, blockDirections }
}

describe('empty block direction', () => {
  test('a new block after right-to-left text is right-to-left', async () => {
    const { editor, blockDirections } = renderEditor([paragraph('שלום')])

    await act(async () => {
      Transforms.select(editor, { path: [0, 0], offset: 4 })
      editor.insertBreak()
    })

    expect(blockDirections()).toEqual(['rtl', 'rtl'])
  })

  test('empty blocks take the nearest sibling with directional text', () => {
    const { blockDirections } = renderEditor([
      paragraph('hello'),
      paragraph('שלום'),
      paragraph('123'),
      paragraph(''),
      paragraph(''),
      paragraph('hello'),
    ])

    expect(blockDirections()).toEqual([null, 'rtl', null, 'rtl', 'rtl', null])
  })

  test('an empty first block takes the direction of the text after it', () => {
    const { blockDirections } = renderEditor([paragraph(''), paragraph('שלום')])

    expect(blockDirections()).toEqual(['rtl', 'rtl'])
  })

  test('empty blocks after left-to-right text stay left-to-right', () => {
    const { blockDirections } = renderEditor([
      paragraph('שלום'),
      paragraph('hello'),
      paragraph(''),
    ])

    expect(blockDirections()).toEqual(['rtl', null, null])
  })
})
