/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({ type: 'code' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />word
      </paragraph>
      <paragraph>
        <focus />another
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <code>
        <anchor />word
      </code>
      <code>
        <focus />another
      </code>
    </document>
  </state>
)
