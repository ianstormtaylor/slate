import React from 'react'
import { createEditor, Descendant, Editor, Transforms } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

jest.mock('slate-dom', () => ({
  ...jest.requireActual('slate-dom'),
  IS_FIREFOX: true,
}))

const renderEditor = (initialValue: Descendant[]) => {
  const editor = withReact(createEditor())
  render(
    <Slate editor={editor} initialValue={initialValue}>
      <Editable />
    </Slate>
  )
  return editor
}

describe('Firefox trailing newlines', () => {
  test.each(['abc\n', 'abc\n\n'])('maps every offset in %j', text => {
    const editor = renderEditor([{ children: [{ text }] }])
    for (let offset = 0; offset <= text.length; offset++) {
      const point = { path: [0, 0], offset }
      const range = { anchor: point, focus: point }
      const domRange = ReactEditor.toDOMRange(editor, range)
      expect(
        ReactEditor.toSlateRange(editor, domRange, {
          exactMatch: true,
          suppressThrow: false,
        })
      ).toEqual(range)
    }
    const end = Editor.end(editor, [])
    const [node] = ReactEditor.toDOMPoint(editor, end)
    const range = document.createRange()
    range.setStart(node, node.textContent!.length)
    range.collapse(true)
    expect(
      ReactEditor.toSlateRange(editor, range, {
        exactMatch: true,
        suppressThrow: false,
      })
    ).toEqual({ anchor: end, focus: end })
  })

  test('maps native text inserted before the extra newline', () => {
    const editor = renderEditor([{ children: [{ text: 'abc\n' }] }])
    const [node] = ReactEditor.toDOMPoint(editor, Editor.end(editor, []))
    node.textContent = 'Z\n'
    const range = document.createRange()
    range.setStart(node, 1)
    range.collapse(true)
    const point = { path: [0, 0], offset: 5 }
    expect(
      ReactEditor.toSlateRange(editor, range, {
        exactMatch: true,
        suppressThrow: false,
      })
    ).toEqual({ anchor: point, focus: point })
  })

  test('copies the model newline without the extra rendering newline', async () => {
    const editor = renderEditor([{ children: [{ text: 'abc\n' }] }])
    await act(async () => Transforms.select(editor, Editor.range(editor, [])))
    const data = new Map<string, string>()
    const transfer = {
      getData: (type: string) => data.get(type) ?? '',
      setData: (type: string, value: string) => data.set(type, value),
    } as unknown as DataTransfer
    ReactEditor.setFragmentData(editor, transfer)
    const html = document.createElement('div')
    html.innerHTML = data.get('text/html')!
    expect(html.textContent).toBe('abc\n')
    expect(data.get('text/plain')).toBe('abc\n')
  })

  test('maps a trailing newline after a marked text node', () => {
    const editor = renderEditor([
      { children: [{ text: 'abc', bold: true }, { text: '\n' }] },
    ] as Descendant[])
    const range = Editor.range(editor, [])
    const domRange = ReactEditor.toDOMRange(editor, range)
    expect(domRange.cloneContents().textContent).toBe('abc\n')
    expect(
      ReactEditor.toSlateRange(editor, domRange, {
        exactMatch: true,
        suppressThrow: false,
      })
    ).toEqual(range)
  })

  test('updates the text after inserting and removing a trailing newline', async () => {
    const editor = renderEditor([{ children: [{ text: 'abc' }] }])
    await act(async () => {
      Transforms.select(editor, Editor.end(editor, []))
      editor.insertText('\n')
    })
    await act(async () => editor.insertText('Z'))
    const domRange = ReactEditor.toDOMRange(editor, Editor.range(editor, []))
    expect(domRange.cloneContents().textContent).toBe('abc\nZ')
    await act(async () => editor.deleteBackward('character'))
    const end = Editor.end(editor, [])
    const range = { anchor: end, focus: end }
    expect(
      ReactEditor.toSlateRange(editor, ReactEditor.toDOMRange(editor, range), {
        exactMatch: true,
        suppressThrow: false,
      })
    ).toEqual(range)
  })
})
