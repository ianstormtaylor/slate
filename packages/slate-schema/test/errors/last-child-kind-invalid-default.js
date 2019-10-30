/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: [{ object: 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <text />
      </quote>
    </document>
  </value>
)
