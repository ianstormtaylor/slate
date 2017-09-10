/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.delete()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one
      </paragraph>
      <image>
        <focus />{' '}
      </image>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        <cursor />
      </image>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
