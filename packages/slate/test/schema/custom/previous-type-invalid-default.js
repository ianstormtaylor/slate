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
      <image>
        <text />
      </image>
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <text />
      </paragraph>
    </document>
  </value>
)
