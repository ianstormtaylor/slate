import React, { useLayoutEffect } from 'react'
import { createEditor, Descendant, Transforms } from 'slate'
import { IS_FOCUSED } from 'slate-dom'
import { act, render } from '@testing-library/react'
import {
  Editable,
  ReactEditor,
  RenderElementProps,
  Slate,
  useSlate,
  withReact,
} from '../src'

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

const p = (text: string) =>
  ({ type: 'paragraph', children: [{ text }] }) as Descendant
const childless = {
  type: 'childless',
  children: [{ text: 'hidden' }],
} as Descendant

const setup = (initialValue: Descendant[], before?: React.ReactNode) => {
  const editor = withReact(createEditor())
  const errors: unknown[] = []
  editor.onDOMError = error => errors.push(error)
  act(() => {
    render(
      <Slate editor={editor} initialValue={initialValue}>
        {before}
        <Editable renderElement={renderElement} />
      </Slate>
    )
  })
  return { editor, errors }
}

describe('DOM lookups that may miss', () => {
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

  test('does not report a lookup from a layout effect after typing', async () => {
    const Probe = () => {
      const editor = useSlate() as ReactEditor
      useLayoutEffect(() => {
        if (editor.selection) {
          ReactEditor.resolveDOMRange(editor, editor.selection)
        }
      })
      return null
    }
    const { editor, errors } = setup([p('abc')], <Probe />)
    await act(async () => {
      Transforms.select(editor, { path: [0, 0], offset: 3 })
    })
    await act(async () => {
      Transforms.insertText(editor, 'd')
    })

    expect(errors).toEqual([])
    expect(
      ReactEditor.resolveDOMRange(editor, editor.selection!)
    ).not.toBeNull()
  })

  test('does not report when replaced children leave the selection past the text', async () => {
    const { editor, errors } = setup([p('hello')])
    IS_FOCUSED.set(editor, true)
    await act(async () => {
      Transforms.select(editor, { path: [0, 0], offset: 5 })
    })
    await act(async () => {
      editor.children = [p('hi')]
      editor.onChange()
    })

    expect(errors).toEqual([])
  })

  test('resolveDOMRange returns a range from a layout effect inside the first render', () => {
    const results: unknown[] = []
    const editor = withReact(createEditor())
    const Widget = () => {
      useLayoutEffect(() => {
        try {
          results.push(
            ReactEditor.resolveDOMRange(editor, {
              anchor: { path: [0, 0], offset: 1 },
              focus: { path: [0, 0], offset: 1 },
            })
          )
        } catch (error) {
          results.push(error)
        }
      }, [])
      return null
    }
    act(() => {
      render(
        <Slate editor={editor} initialValue={[p('abc')]}>
          <Editable
            renderElement={({ attributes, children }) => (
              <div {...attributes}>
                {children}
                <Widget />
              </div>
            )}
          />
        </Slate>
      )
    })

    expect(results[0] instanceof Error).toBe(false)
  })

  test('does not throw when a selection ends in an element that does not render its children', async () => {
    const thrown: unknown[] = []
    const onError = (event: ErrorEvent) => {
      thrown.push(event.error)
      event.preventDefault()
    }
    window.addEventListener('error', onError)
    try {
      const { editor } = setup([p('shown'), childless, p('b')])
      IS_FOCUSED.set(editor, true)
      await act(async () => {
        Transforms.select(editor, {
          anchor: { path: [0, 0], offset: 0 },
          focus: { path: [2, 0], offset: 0 },
        })
      })
    } catch (error) {
      thrown.push(error)
    } finally {
      window.removeEventListener('error', onError)
    }

    expect(thrown.map(String)).toEqual([])
  })

  test('returns null for a range inside an element that does not render its children', () => {
    const { editor, errors } = setup([p('shown'), childless])

    expect(
      ReactEditor.resolveDOMRange(editor, {
        anchor: { path: [1, 0], offset: 1 },
        focus: { path: [1, 0], offset: 3 },
      })
    ).toBeNull()
    expect(errors).toEqual([])
  })
})
