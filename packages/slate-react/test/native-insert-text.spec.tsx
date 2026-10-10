import React from 'react'
import { act, fireEvent, render } from '@testing-library/react'
import { createEditor, Node, NodeEntry, Range, Transforms } from 'slate'
import { IS_NODE_MAP_DIRTY } from 'slate-dom'
import { Editable, ReactEditor, Slate, withReact } from '../src'

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

const decorate = ([node, path]: NodeEntry): Array<
  Range & { highlight: boolean }
> =>
  Node.isText(node)
    ? [
        {
          anchor: { path, offset: 0 },
          focus: { path, offset: 3 },
          highlight: true,
        },
      ]
    : []

const setup = async (decorated: boolean, offset: number) => {
  let beforeInput: EventListener | undefined
  const addEventListener = HTMLElement.prototype.addEventListener
  const listenerSpy = jest
    .spyOn(HTMLElement.prototype, 'addEventListener')
    .mockImplementation(function (this: HTMLElement, type, listener, options) {
      if (type === 'beforeinput' && typeof listener === 'function') {
        beforeInput = listener
      }
      return addEventListener.call(this, type, listener, options)
    })
  const editor = withReact(createEditor())
  const insertText = editor.insertText
  editor.insertText = (text, options) => {
    if (!/[A-Z]/.test(text)) {
      insertText(text, options)
    }
  }

  render(
    <Slate editor={editor} initialValue={[{ children: [{ text: 'abcdef' }] }]}>
      <Editable decorate={decorated ? decorate : undefined} />
    </Slate>
  )
  listenerSpy.mockRestore()

  await act(async () => {
    Transforms.select(editor, { path: [0, 0], offset })
  })

  const editable = ReactEditor.toDOMNode(editor, editor)
  const nativeInput = async (leaf: number, domOffset: number, data: string) => {
    const node = editable.querySelectorAll('[data-slate-string]')[leaf]
      .firstChild!
    if (!(node instanceof window.Text)) {
      throw new Error('Expected a DOM text node')
    }
    window.getSelection()!.collapse(node, domOffset)
    const range = document.createRange()
    range.setStart(node, domOffset)
    range.collapse(true)
    const preventDefault = jest.fn()

    await act(async () => {
      beforeInput!.call(editable, {
        isTrusted: true,
        target: editable,
        inputType: 'insertText',
        data,
        getTargetRanges: () => [range],
        preventDefault,
      } as unknown as InputEvent)

      if (!preventDefault.mock.calls.length) {
        node.insertData(domOffset, data)
        window.getSelection()!.collapse(node, domOffset + data.length)
      }
      fireEvent.input(editable, { inputType: 'insertText', data })
    })
  }

  return { editor, editable, nativeInput }
}

afterEach(() => {
  jest.restoreAllMocks()
})

test('removes a rejected native insertion from an undecorated text node', async () => {
  const { editor, editable, nativeInput } = await setup(false, 6)
  await nativeInput(0, 6, 'X')

  expect(Node.string(editor)).toBe('abcdef')
  expect(editable.textContent).toBe('abcdef')
})

test('removes a rejected insertion from the actual leaf at a decoration boundary', async () => {
  const { editor, editable, nativeInput } = await setup(true, 3)
  await nativeInput(1, 0, 'X')

  expect(Node.string(editor)).toBe('abcdef')
  expect(editable.textContent).toBe('abcdef')
  await nativeInput(1, 0, 'g')
  expect(Node.string(editor)).toBe('abcgdef')
  expect(editable.textContent).toBe('abcgdef')
})

test('does not resolve a native insertion point while the node map is dirty', async () => {
  const { editor, nativeInput } = await setup(false, 6)
  IS_NODE_MAP_DIRTY.set(editor, true)
  const toDOMPoint = jest.spyOn(ReactEditor, 'toDOMPoint')
  await nativeInput(0, 6, 'X')

  expect(toDOMPoint).not.toHaveBeenCalled()
})
