/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    image: {
      next: [{ object: o => o === 'text' }],
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
