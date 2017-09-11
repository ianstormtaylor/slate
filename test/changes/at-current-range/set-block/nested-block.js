/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({ type: 'code' })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <paragraph>
          <cursor />word
        </paragraph>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <code>
          <cursor />word
        </code>
      </paragraph>
    </document>
  </state>
)
