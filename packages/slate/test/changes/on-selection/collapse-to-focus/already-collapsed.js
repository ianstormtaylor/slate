/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.collapseToFocus()
}

export const input = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </state>
)
