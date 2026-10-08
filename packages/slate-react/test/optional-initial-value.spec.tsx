import React from 'react'
import { createEditor, Descendant } from 'slate'
import { render } from '@testing-library/react'
import { Slate, withReact, Editable } from '../src'

const value = (text: string): Descendant[] => [{ children: [{ text }] }]

describe('Slate without initialValue', () => {
  it("uses the editor's existing children", () => {
    const editor = withReact(createEditor())
    const children = value('prefilled')
    editor.children = children

    const { container } = render(
      <Slate editor={editor}>
        <Editable />
      </Slate>
    )

    expect(editor.children).toBe(children)
    expect(container.textContent).toContain('prefilled')
  })

  it('prefers initialValue when both are given', () => {
    const editor = withReact(createEditor())
    editor.children = value('prefilled')
    const initialValue = value('initial')

    render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable />
      </Slate>
    )

    expect(editor.children).toBe(initialValue)
  })

  it('throws when the editor is empty and no initialValue is given', () => {
    const editor = withReact(createEditor())
    const spy = jest.spyOn(console, 'error').mockImplementation(() => {})

    expect(() =>
      render(
        <Slate editor={editor}>
          <Editable />
        </Slate>
      )
    ).toThrow('editor.children is empty and no initialValue was provided')

    spy.mockRestore()
  })
})
