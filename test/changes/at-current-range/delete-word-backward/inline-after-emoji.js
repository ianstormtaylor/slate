/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteWordBackward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>word</link>📛<cursor />
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
