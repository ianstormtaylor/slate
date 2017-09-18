/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.deleteForward()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <anchor />one<link>t<focus />wo</link>
      </paragraph>
    </document>
  </state>
)

// TODO: this output selection state seems bad
export const output = (
  <state>
    <document>
      <paragraph>
        <anchor /><link><focus />wo</link>
      </paragraph>
    </document>
  </state>
)
