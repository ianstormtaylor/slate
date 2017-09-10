/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.wrapText('[[', ']]')
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        [[<cursor />]]
      </paragraph>
    </document>
  </state>
)
