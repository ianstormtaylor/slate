/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: 'paragraph' }],
          max: 1,
        },
      ],
    },
  },
}

export const input = (
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

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          <text />
        </paragraph>
      </quote>
    </document>
  </value>
)
