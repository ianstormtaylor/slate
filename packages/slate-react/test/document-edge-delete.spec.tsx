import React from 'react'
import { createEditor } from 'slate'
import * as SlateDOM from 'slate-dom'
import { act, fireEvent, render } from '@testing-library/react'
import { Editable, ReactEditor, Slate, withReact } from '../src'

jest.mock('slate-dom', () => ({
  ...jest.requireActual('slate-dom'),
  HAS_BEFORE_INPUT_SUPPORT: true,
  IS_WEBKIT: true,
  IS_CHROME: false,
}))

Object.defineProperty(HTMLElement.prototype, 'isContentEditable', {
  get() {
    return (
      this.closest('[contenteditable]')?.getAttribute('contenteditable') ===
      'true'
    )
  },
})

afterEach(() => jest.restoreAllMocks())

const scenarios = [
  { key: 'Backspace', which: 8, method: 'deleteBackward' as const, offset: 0 },
  { key: 'Delete', which: 46, method: 'deleteForward' as const, offset: 5 },
]

for (const scenario of scenarios) {
  describe(`${scenario.key} at the document boundary`, () => {
    const setup = async (guard?: string) => {
      if (guard === 'android') {
        jest.replaceProperty(
          jest.requireMock<typeof SlateDOM>('slate-dom'),
          'IS_WEBKIT',
          false
        )
        jest.replaceProperty(
          jest.requireMock<typeof SlateDOM>('slate-dom'),
          'IS_ANDROID',
          true
        )
      }
      const editor = withReact(createEditor())
      editor[scenario.method] = jest.fn()
      render(
        <Slate
          editor={editor}
          initialValue={[{ children: [{ text: 'hello' }] }]}
        >
          <Editable
            readOnly={guard === 'readonly'}
            onKeyDown={
              guard === 'handled' ? event => event.preventDefault() : undefined
            }
          />
        </Slate>
      )
      await act(async () => {
        const anchor = {
          path: [0, 0],
          offset: guard === 'inside' ? 2 : scenario.offset,
        }
        editor.select(
          guard === 'expanded'
            ? { anchor, focus: { path: [0, 0], offset: 3 } }
            : anchor
        )
      })
      if (guard === 'composing') SlateDOM.IS_COMPOSING.set(editor, true)
      let allowed = true
      await act(async () => {
        allowed = fireEvent.keyDown(ReactEditor.toDOMNode(editor, editor), {
          key: scenario.key,
          which: scenario.which,
          isComposing: guard === 'composing',
        })
      })
      return { editor, allowed }
    }

    test('calls the override once and prevents the native default', async () => {
      const { editor, allowed } = await setup()
      expect(editor[scenario.method]).toHaveBeenCalledTimes(1)
      expect(editor[scenario.method]).toHaveBeenCalledWith('character')
      expect(allowed).toBe(false)
    })

    test.each([
      'inside',
      'expanded',
      'composing',
      'handled',
      'readonly',
      'android',
    ])('does not intercept the %s path', async guard => {
      const { editor } = await setup(guard)
      expect(editor[scenario.method]).not.toHaveBeenCalled()
    })
  })
}
