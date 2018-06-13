/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      nodes: [{ objects: ['text'] }],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <link>text</link>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote />
    </document>
  </value>
)
