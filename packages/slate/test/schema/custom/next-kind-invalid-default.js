/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    image: {
      next: [{ object: 'text' }],
    },
  },
}

export const input = (
  <value>
    <document>
      <block>
        <block void>
          <text />
        </block>
        <quote>
          <text />
        </quote>
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
