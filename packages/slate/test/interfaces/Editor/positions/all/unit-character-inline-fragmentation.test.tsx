import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-character-inline-fragmentation', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        1<inline>2</inline>3
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [], unit: 'character' }))
  }

  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 0], offset: 1 },
    { path: [0, 1, 0], offset: 1 },
    { path: [0, 2], offset: 1 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
