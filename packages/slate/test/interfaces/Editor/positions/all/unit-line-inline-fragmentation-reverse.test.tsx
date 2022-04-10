import { test, expect } from 'vitest'
import { Editor } from 'slate'
import { jsx } from '../../../..'

test('positions-all-unit-line-inline-fragmentation-reverse', () => {
  /** @jsx jsx */

  const input = (
    <editor>
      <block>
        he<inline>ll</inline>o wo<inline>rl</inline>d
      </block>
    </editor>
  )
  const test = editor => {
    return Array.from(
      Editor.positions(editor, { at: [], unit: 'line', reverse: true })
    )
  }

  const output = [
    { path: [0, 4], offset: 1 },
    { path: [0, 0], offset: 0 },
  ]

  const result = test(withTest(input))
  expect(result).toEqual(output)
})
