/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<anchor />
      </paragraph>
      <paragraph>
        <focus />two<link>three</link>four
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor />two<link>three</link>four
      </paragraph>
    </document>
  </value>
)
