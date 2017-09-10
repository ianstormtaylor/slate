/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({ type: 'code' })
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
      <code>
        <cursor />word
      </code>
    </document>
  </state>
)
