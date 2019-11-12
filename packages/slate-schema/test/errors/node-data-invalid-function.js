/** @jsx jsx */

import { jsx } from '../../helpers'

export const schema = {
  blocks: {
    paragraph: {
      data: d => d.get('thing') === 'valid',
    },
  },
}

export const input = (
  <value>
    <document>
      <paragraph thing="valid">
        <text />
      </block>
      <paragraph thing="invalid">
        <text />
      </block>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph thing="valid">
        <text />
      </block>
    </document>
  </value>
)
