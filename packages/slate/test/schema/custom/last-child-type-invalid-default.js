/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: { type: 'paragraph' },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
        <image />
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph />
        <paragraph />
      </quote>
    </document>
  </value>
)
