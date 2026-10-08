import React from 'react'
import { createEditor, Descendant, Node, Path, Point, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Slate, withReact, Editable, ReactEditor } from '../src'

jest.mock('slate-dom', () => ({
  ...jest.requireActual('slate-dom'),
  HAS_BEFORE_INPUT_SUPPORT: true,
}))

Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

const chromeCaret = (editor: ReactEditor): Point => {
  const { anchor } = editor.selection!
  const text = Node.get(editor, anchor.path) as { text: string }
  const next = Path.next(anchor.path)

  return text.text.endsWith('\n') &&
    anchor.offset === text.text.length &&
    Node.has(editor, next)
    ? { path: next, offset: 0 }
    : anchor
}

describe('typing after a soft break at the end of a leaf', () => {
  test('keeps the typed characters in order', async () => {
    const addEventListener = HTMLElement.prototype.addEventListener
    let onBeforeInput: ((event: unknown) => void) | undefined
    const spy = jest
      .spyOn(HTMLElement.prototype, 'addEventListener')
      .mockImplementation(function (
        this: HTMLElement,
        type: string,
        listener: any,
        options?: any
      ) {
        if (type === 'beforeinput') {
          onBeforeInput = listener
        }
        return addEventListener.call(this, type, listener, options)
      })

    const editor = withReact(createEditor())
    const initialValue = [
      { children: [{ text: 'rich\n', bold: true }, { text: ' text' }] },
    ] as Descendant[]

    act(() => {
      render(
        <Slate editor={editor} initialValue={initialValue}>
          <Editable />
        </Slate>
      )
    })
    spy.mockRestore()

    await act(async () => {
      Transforms.select(editor, { path: [0, 0], offset: 5 })
    })

    const editable = ReactEditor.toDOMNode(editor, editor)

    for (const data of ['1', '2', '3']) {
      const [node, offset] = ReactEditor.toDOMPoint(editor, chromeCaret(editor))
      const range = document.createRange()
      range.setStart(node, offset)
      range.setEnd(node, offset)

      await act(async () => {
        onBeforeInput!({
          isTrusted: true,
          inputType: 'insertText',
          data,
          target: editable,
          getTargetRanges: () => [range],
          preventDefault: () => {},
          stopImmediatePropagation: () => {},
        })
      })
    }

    expect(Node.string(editor)).toBe('rich\n123 text')
  })
})
