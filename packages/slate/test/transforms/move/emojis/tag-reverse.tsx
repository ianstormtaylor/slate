/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor) => {
  Transforms.move(editor, { reverse: true })
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        word🏴󠁧󠁢󠁳󠁣󠁴󠁿
        <cursor />
      </inline>
      <text />
    </block>
  </editor>
)
export const output = (
  <editor>
    <block>
      <text />
      <inline>
        word
        <cursor />
        🏴󠁧󠁢󠁳󠁣󠁴󠁿
      </inline>
      <text />
    </block>
  </editor>
)
