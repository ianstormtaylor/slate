import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-character-inline-fragmentation-multibyte', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        😀<inline>😀</inline>😀
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
  }

  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 0], offset: 2 },
    { path: [0, 1, 0], offset: 2 },
    { path: [0, 2], offset: 2 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
