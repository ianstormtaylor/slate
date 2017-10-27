/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.collapseToFocus()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor />
      </paragraph>
    </document>
  </value>
)
