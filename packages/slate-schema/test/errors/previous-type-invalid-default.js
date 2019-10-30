/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      previous: [{ type: 'paragraph' }],
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
