/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: t => t === 'paragraph' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <block void>
        <text />
      </block>
      <block>
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)
