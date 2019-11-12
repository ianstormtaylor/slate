/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      last: { type: t => t === 'paragraph' },
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
        <block>
          <text />
        </block>
        <block void>
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
        <block>
          <text />
        </block>
        <block>
          <text />
        </block>
      </quote>
    </document>
  </value>
)
