/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Text, Transforms } from 'slate'

export const run = (editor) => {
  Transforms.setNodes(
    editor,
    { someKey: true },
    { match: Text.isText, split: true }
  )
}
export const input = (
  <editor>
    <block>
      w<cursor />
      ord
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      w<cursor />
      ord
    </block>
  </editor>
)
