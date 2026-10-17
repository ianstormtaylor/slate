import React from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { IS_FOCUSED } from 'slate-dom'
import { act, render } from '@testing-library/react'
import { Editable, RenderElementProps, Slate, withReact } from '../src'
import { getPointAboveTrailingNewline } from '../src/utils/trailing-newline'

const renderElement = ({
  attributes,
  children,
  element,
}: RenderElementProps) =>
  (element as { type?: string }).type === 'childless' ? (
    <div {...attributes} />
  ) : (
    <p {...attributes}>{children}</p>
  )

describe('reporting DOM mapping failures', () => {
  test('reports through the global error handler by default', () => {
    const editor = withReact(createEditor())
    const error = new Error('unmapped')
    const reported: unknown[] = []
    const original = globalThis.reportError
    globalThis.reportError = reportedError => reported.push(reportedError)

    try {
      editor.onDOMError(error)
    } finally {
      globalThis.reportError = original
    }

    expect(reported).toEqual([error])
  })

  test('measures nothing on ArrowUp before the editor is mounted', () => {
    const editor = withReact(createEditor())
    editor.children = [
      { type: 'paragraph', children: [{ text: 'line\n' }] } as Descendant,
      { type: 'paragraph', children: [{ text: 'next' }] } as Descendant,
    ]
    const errors: unknown[] = []
    editor.onDOMError = error => errors.push(error)

    expect(
      getPointAboveTrailingNewline(editor, { path: [1, 0], offset: 2 })
    ).toBeNull()
    expect(errors).toEqual([])
  })

  test('reports a selection inside an element that does not render its children', async () => {
    const editor = withReact(createEditor())
    const errors: unknown[] = []
    editor.onDOMError = error => errors.push(error)
    const initialValue = [
      { type: 'paragraph', children: [{ text: 'shown' }] } as Descendant,
      { type: 'childless', children: [{ text: 'hidden' }] } as Descendant,
    ]
    render(
      <Slate editor={editor} initialValue={initialValue}>
        <Editable renderElement={renderElement} />
      </Slate>
    )

    IS_FOCUSED.set(editor, true)
    await act(async () => {
      Transforms.select(editor, { path: [1, 0], offset: 2 })
    })

    expect(errors).toHaveLength(1)
  })
})
