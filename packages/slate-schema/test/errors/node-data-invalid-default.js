/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      data: {
        thing: v => v == null || v === 'value',
      },
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph thing="invalid">
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <block>
        <text />
      </block>
    </document>
  </value>
)
