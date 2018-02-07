/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <focus />one
        </link>
        middle<anchor />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <focus />
        </link>
        <anchor />two
      </paragraph>
    </document>
  </value>
)
