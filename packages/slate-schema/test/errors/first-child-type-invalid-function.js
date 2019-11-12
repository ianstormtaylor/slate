/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {},
    quote: {
      first: { type: t => t === 'paragraph' },
    },
  },
}

export const input = (
  <value>
    <document>
      <quote>
        <block void>
          <text />
        </block>
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
