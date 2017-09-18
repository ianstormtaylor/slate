/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertText('a')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<b>or<cursor /></b>d
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<b>ora<cursor /></b>d
      </paragraph>
    </document>
  </state>
)
