/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({
    type: 'code',
    data: { thing: 'value' }
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <code thing="value">
        <cursor />word
      </code>
    </document>
  </state>
)
