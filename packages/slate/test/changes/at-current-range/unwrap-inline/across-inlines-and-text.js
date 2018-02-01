/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapInline('link')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <anchor />one
        </link>two<link>
          three<focus />
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />onetwothree<focus />
      </paragraph>
    </document>
  </value>
)
