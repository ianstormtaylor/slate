/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: { type: 'paragraph' },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <image>
          <text />
        </image>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
