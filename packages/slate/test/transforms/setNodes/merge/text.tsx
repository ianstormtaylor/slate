/** @jsx jsx */
import { Transforms, Text } from 'slate'
import { jsx } from '../../..'
import _ from 'lodash'

export const run = editor => {
  Transforms.setNodes(
    editor,
    { a: { b: 2, c: 3 } },
    { at: [0, 0], match: Text.isText, merge: (n, p) => _.defaultsDeep(p, n) }
  )
}
export const input = (
  <editor>
    <block>
      <text a={{ b: 1 }}>word</text>
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text a={{ b: 2, c: 3 }}>word</text>
    </block>
  </editor>
)
