/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [
        {
          match: [{ type: t => t === 'paragraph' }],
        },
      ],
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
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document />
  </value>
)
