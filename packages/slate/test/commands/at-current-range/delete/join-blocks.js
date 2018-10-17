/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<anchor />
      </paragraph>
      <paragraph>
        <focus />another
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<cursor />another
      </paragraph>
    </document>
  </value>
)
