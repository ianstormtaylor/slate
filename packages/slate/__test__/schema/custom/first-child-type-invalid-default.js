/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: { types: ['paragraph'] },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <image />
        <paragraph />
        <paragraph />
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
