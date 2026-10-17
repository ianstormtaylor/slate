import React from 'react'
import { createEditor, Descendant, Node, Path, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const paragraph = (text: string) =>
  ({ children: [{ text }] }) as unknown as Descendant

const renderWithOnChange = (initialValue: Descendant[]) => {
  const editor = withReact(createEditor())
  const seen: { expected: Path; found: Path | string }[][] = []
  const onChange = () => {
    seen.push(
      Array.from(Node.nodes(editor), ([node, path]) => {
        let found: Path | string
        try {
          found = ReactEditor.findPath(editor, node)
        } catch (error) {
          found = (error as Error).message
        }
        return { expected: path, found }
      })
    )
  }
  render(
    <Slate editor={editor} initialValue={initialValue} onChange={onChange}>
      <Editable />
    </Slate>
  )
  return { editor, seen }
}

const expectAllFound = (seen: { expected: Path; found: Path | string }[][]) => {
  expect(seen.length).toBeGreaterThan(0)
  for (const entries of seen) {
    for (const { expected, found } of entries) {
      expect(found).toEqual(expected)
    }
  }
}

describe('ReactEditor.findPath inside onChange', () => {
  test('finds every node after a block is split', async () => {
    const { editor, seen } = renderWithOnChange([
      paragraph('first'),
      paragraph('second'),
    ])

    await act(async () => {
      Transforms.select(editor, { path: [0, 0], offset: 2 })
      editor.insertBreak()
    })

    expectAllFound(seen)
  })

  test('finds every node after blocks are removed and moved', async () => {
    const { editor, seen } = renderWithOnChange([
      paragraph('a'),
      paragraph('b'),
      paragraph('c'),
    ])

    await act(async () => {
      Transforms.removeNodes(editor, { at: [0] })
      Transforms.moveNodes(editor, { at: [1], to: [0] })
    })

    expectAllFound(seen)
  })

  test('still throws for a node that is not in the editor', () => {
    const { editor } = renderWithOnChange([paragraph('a')])

    expect(() => ReactEditor.findPath(editor, paragraph('a') as Node)).toThrow(
      'Unable to find the path for Slate node'
    )
  })
})
