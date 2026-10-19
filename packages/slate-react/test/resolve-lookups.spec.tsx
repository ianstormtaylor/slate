import React from 'react'
import { createEditor, Descendant } from 'slate'
import { act, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

const value: Descendant[] = [
  { type: 'paragraph', children: [{ text: 'one' }] } as Descendant,
]

const setup = () => {
  const editor = withReact(createEditor())
  const errors: unknown[] = []
  editor.onDOMError = error => errors.push(error)
  let container!: HTMLElement
  act(() => {
    ;({ container } = render(
      <Slate editor={editor} initialValue={value}>
        <Editable />
      </Slate>
    ))
  })
  const domText = container.querySelector('[data-slate-string]')!.firstChild!
  return { editor, errors, domText }
}

const unmountedEditor = () => {
  const editor = withReact(createEditor())
  editor.children = value
  return editor
}

describe('resolve lookups', () => {
  test('resolveDOMNode finds rendered nodes and returns null otherwise', () => {
    const { editor, errors } = setup()

    expect(ReactEditor.resolveDOMNode(editor, editor)).toBe(
      ReactEditor.toDOMNode(editor, editor)
    )
    expect(ReactEditor.resolveDOMNode(editor, editor.children[0])).toBe(
      ReactEditor.toDOMNode(editor, editor.children[0])
    )
    expect(
      ReactEditor.resolveDOMNode(editor, {
        type: 'paragraph',
        children: [{ text: 'detached' }],
      } as Descendant)
    ).toBeNull()
    expect(
      ReactEditor.resolveDOMNode(unmountedEditor(), editor.children[0])
    ).toBeNull()
    expect(errors).toEqual([])
  })

  test('resolveSlateNode finds the node and returns null outside Slate', () => {
    const { editor, errors, domText } = setup()

    expect(ReactEditor.resolveSlateNode(editor, domText)).toBe(
      ReactEditor.toSlateNode(editor, domText)
    )
    expect(
      ReactEditor.resolveSlateNode(editor, document.createElement('div'))
    ).toBeNull()
    expect(
      ReactEditor.resolveSlateNode(editor, document.createTextNode('loose'))
    ).toBeNull()
    expect(errors).toEqual([])
  })

  test('resolveSlatePoint matches toSlatePoint and returns null on a miss', () => {
    const { editor, errors, domText } = setup()

    expect(ReactEditor.resolveSlatePoint(editor, [domText, 2])).toEqual({
      path: [0, 0],
      offset: 2,
    })
    expect(
      ReactEditor.resolveSlatePoint(editor, [document.createElement('div'), 0])
    ).toBeNull()
    expect(errors).toEqual([])
  })

  test('resolveSlatePoint returns null where suppressThrow still throws', () => {
    const editor = unmountedEditor()
    const parent = document.createElement('div')
    const loose = document.createTextNode('loose')
    parent.appendChild(loose)

    expect(() =>
      ReactEditor.toSlatePoint(editor, [loose, 0], {
        exactMatch: false,
        suppressThrow: true,
      })
    ).toThrow()
    expect(ReactEditor.resolveSlatePoint(editor, [loose, 0])).toBeNull()
  })

  test('resolveSlateRange matches toSlateRange and returns null on a miss', () => {
    const { editor, errors, domText } = setup()
    const domRange = document.createRange()
    domRange.setStart(domText, 1)
    domRange.setEnd(domText, 3)

    expect(ReactEditor.resolveSlateRange(editor, domRange)).toEqual({
      anchor: { path: [0, 0], offset: 1 },
      focus: { path: [0, 0], offset: 3 },
    })

    const outside = document.createRange()
    outside.selectNodeContents(document.createElement('div'))
    expect(ReactEditor.resolveSlateRange(editor, outside)).toBeNull()
    expect(errors).toEqual([])
  })

  test('resolveSlateRange returns null where suppressThrow still throws', () => {
    const { editor } = setup()
    const selection = window.getSelection()!
    selection.removeAllRanges()

    expect(() =>
      ReactEditor.toSlateRange(editor, selection, {
        exactMatch: false,
        suppressThrow: true,
      })
    ).toThrow()
    expect(ReactEditor.resolveSlateRange(editor, selection)).toBeNull()
  })
})
