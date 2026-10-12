import React from 'react'
import { createEditor, Descendant, Element, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, Slate, withReact } from '../src'

const paragraph = (text: string) =>
  ({ type: 'paragraph', children: [{ text }] }) as Element

const setup = () => {
  const editor = withReact(createEditor())
  editor.children = [paragraph('start')]
  return editor
}

describe('inserting node objects that are already in use', () => {
  test('inserting the same object twice inserts two distinct nodes', () => {
    const editor = setup()
    const template = paragraph('template')

    Transforms.insertNodes(editor, template, { at: [1] })
    Transforms.insertNodes(editor, template, { at: [2] })

    expect(editor.children[1]).not.toBe(editor.children[2])
    expect(editor.children[1]).toEqual(editor.children[2])
    expect((editor.children[1] as Element).children[0]).not.toBe(
      (editor.children[2] as Element).children[0]
    )
  })

  test('the first insertion keeps the object it was given', () => {
    const editor = setup()
    const node = paragraph('fresh')

    Transforms.insertNodes(editor, node, { at: [1] })

    expect(editor.children[1]).toBe(node)
  })

  test('re-inserting a rendered node does not duplicate React keys', () => {
    const editor = withReact(createEditor())
    const initialValue: Descendant[] = [paragraph('one'), paragraph('two')]
    const errors: string[] = []
    const error = jest
      .spyOn(console, 'error')
      .mockImplementation((...args) => errors.push(args.join(' ')))

    act(() => {
      render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
    })

    act(() => {
      Transforms.insertNodes(editor, editor.children[0] as Element, { at: [2] })
    })

    error.mockRestore()
    expect(editor.children[2]).not.toBe(editor.children[0])
    expect(errors.filter(message => message.includes('same key'))).toEqual([])
  })
})
