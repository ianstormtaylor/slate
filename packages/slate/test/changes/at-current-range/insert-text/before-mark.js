/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<cursor /><b>or</b>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wa<cursor /><b>or</b>d
      </paragraph>
    </document>
  </state>
)
