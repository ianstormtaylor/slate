/** @jsx jsx */

import { jsx } from '../../../../helpers'

export const run = editor => {
  editor.insertFragment(<block>fragment</block>)
}

export const input = (
  <value>
    <block>
      <inline>
        {'word '}
        <cursor />
      </inline>
    </block>
  </value>
)

// TODO: argument to made that fragment should go into the inline
export const output = (
  <value>
    <block>
      <inline>{'word '}</inline>
      fragment
      <cursor />
      <inline>
        <text />
      </inline>
    </block>
  </value>
)
