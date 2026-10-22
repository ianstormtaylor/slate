import React from 'react'
import { render } from '@testing-library/react'

Object.defineProperty(window.navigator, 'userAgent', {
  configurable: true,
  value: 'Mozilla/5.0 (Android 10; Mobile; rv:144.0) Gecko/144.0 Firefox/144.0',
})

const { createEditor } = require('slate') as typeof import('slate')
const { IS_ANDROID } = require('slate-dom') as typeof import('slate-dom')
const { Editable, ReactEditor, Slate, withReact } =
  require('../src') as typeof import('../src')

const renderDetachedText = () => {
  const editor = withReact(createEditor())
  render(
    <Slate editor={editor} initialValue={[{ children: [{ text: 'rathe' }] }]}>
      <Editable />
    </Slate>
  )
  const string = ReactEditor.toDOMNode(editor, editor).querySelector(
    '[data-slate-string]'
  )!
  const text = string.firstChild!
  string.removeChild(text)
  return { editor, text }
}

describe('a DOM point in a text node the keyboard detached on Android', () => {
  test('runs as Android', () => {
    expect(IS_ANDROID).toBe(true)
  })

  test('resolves to no point instead of throwing', () => {
    const { editor, text } = renderDetachedText()

    expect(
      ReactEditor.toSlatePoint(editor, [text, 2], {
        exactMatch: false,
        suppressThrow: true,
      })
    ).toBeNull()
    expect(ReactEditor.resolveSlatePoint(editor, [text, 2])).toBeNull()
  })

  test('reports the usual error when throwing is allowed', () => {
    const { editor, text } = renderDetachedText()

    expect(() =>
      ReactEditor.toSlatePoint(editor, [text, 2], {
        exactMatch: false,
        suppressThrow: false,
      })
    ).toThrow('Cannot resolve a Slate point from DOM point')
  })
})
