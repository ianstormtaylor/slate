/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<emoji>
          <anchor />
        </emoji>two
      </paragraph>
      <paragraph>
        <focus />three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<cursor />three
      </paragraph>
    </document>
  </value>
)
