import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-word-inline-fragmentation', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        he<inline>ll</inline>o wo<inline>rl</inline>d
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [], unit: 'word' }))
  }

  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 2], offset: 1 },
    { path: [0, 4], offset: 1 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
