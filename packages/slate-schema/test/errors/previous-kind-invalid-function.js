/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      previous: [{ object: o => o === 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <quote>
          <text />
        </quote>
        <block void>
          <text />
        </block>
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <block void>
          <text />
        </block>
      </block>
    </document>
  </value>
)
