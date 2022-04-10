import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-inline-fragmentation-empty-text', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        <text />
        <inline>
          <text />
          <inline>
            <text />
          </inline>
          <text />
        </inline>
        <text />
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(Editor.positions(editor, { at: [] }))
  }
  const output = [
    { path: [0, 0], offset: 0 },
    { path: [0, 1, 0], offset: 0 },
    { path: [0, 1, 1, 0], offset: 0 },
    { path: [0, 1, 2], offset: 0 },
    { path: [0, 2], offset: 0 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
