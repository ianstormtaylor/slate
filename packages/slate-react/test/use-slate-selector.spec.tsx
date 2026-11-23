import React from 'react'
import { createEditor, Transforms } from 'slate'
import { act, render, renderHook } from '@testing-library/react'
import { Slate, withReact, Editable, useSlateSelector } from '../src'
import _ from 'lodash'

describe('useSlateSelector', () => {
  test('should use equality function when selector changes', async () => {
    const editor = withReact(createEditor())
    const initialValue = [{ type: 'block', children: [{ text: 'test' }] }]

    const callback1 = jest.fn(() => [])
    const callback2 = jest.fn(() => [])

    const { result, rerender } = renderHook(
      ({ callback }) => useSlateSelector(callback, _.isEqual),
      {
        initialProps: {
          callback: callback1,
        },
        wrapper: ({ children }) => (
          <Slate editor={editor} initialValue={initialValue}>
            <Editable />
            {children}
          </Slate>
        ),
      }
    )

    // One call in the render body, and one call in the effect
    expect(callback1).toBeCalledTimes(2)

    const firstResult = result.current

    await act(async () => {
      Transforms.insertText(editor, '!', { at: { path: [0, 0], offset: 4 } })
    })

    // The new call is from the effect
    expect(callback1).toBeCalledTimes(3)

    // Return values should have referential equality because of the custom equality function
    expect(firstResult).toBe(result.current)

    // Callback 2 has not been used yet
    expect(callback2).toBeCalledTimes(0)

    // Re-render with new function identity
    rerender({ callback: callback2 })

    // Callback 1 is not called
    expect(callback1).toBeCalledTimes(3)

    // Callback 2 is used instead
    expect(callback2).toBeCalledTimes(1)

    // Return values should have referential equality because of the custom equality function
    expect(firstResult).toBe(result.current)
  })

  test('discards queued updates when a deferred selector unmounts', async () => {
    const editor = withReact(createEditor())
    const initialValue = [{ children: [{ text: 'test' }] }]
    const activeSelector = jest.fn(() => false)
    const removedSelector = jest.fn(() => false)

    const DeferredSelector = ({ selector }: { selector: () => boolean }) => {
      useSlateSelector(selector, undefined, { deferred: true })
      return null
    }

    const renderSlate = (
      showRemovedSelector: boolean,
      showEditable: boolean
    ) => (
      <Slate editor={editor} initialValue={initialValue}>
        <DeferredSelector selector={activeSelector} />
        {showRemovedSelector && <DeferredSelector selector={removedSelector} />}
        {showEditable && <Editable />}
      </Slate>
    )

    const { rerender } = render(renderSlate(true, false))
    activeSelector.mockClear()
    removedSelector.mockClear()

    await act(async () => {
      Transforms.insertText(editor, '!', { at: { path: [0, 0], offset: 4 } })
    })
    expect(activeSelector).not.toHaveBeenCalled()
    expect(removedSelector).not.toHaveBeenCalled()

    rerender(renderSlate(false, false))
    rerender(renderSlate(false, true))

    expect(activeSelector).toHaveBeenCalledTimes(1)
    expect(removedSelector).not.toHaveBeenCalled()
  })
})
