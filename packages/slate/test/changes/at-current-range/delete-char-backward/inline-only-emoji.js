/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteCharBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>📛<cursor /></link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)
