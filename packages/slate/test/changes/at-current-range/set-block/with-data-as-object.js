/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setBlocks({
    type: 'code',
    data: { thing: 'value' },
  })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <code thing="value">
        <cursor />word
      </code>
    </document>
  </value>
)
