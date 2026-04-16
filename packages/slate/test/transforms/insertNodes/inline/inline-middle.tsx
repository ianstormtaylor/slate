/** @jsx jsx */

import { jsx } from '../../..'

jsx

import { Transforms } from 'slate'

export const run = (editor, options = {}) => {
  Transforms.insertNodes(
    editor,
    <inline void>
      <text />
    </inline>,
    options
  )
}
export const input = (
  <editor>
    <block>
      <text />
      <inline>
        wo
        <cursor />
        rd
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
        wo
        <inline void>
          <cursor />
        </inline>
        rd
      </inline>
      <text />
    </block>
  </editor>
)
