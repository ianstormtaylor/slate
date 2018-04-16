/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />one<link>
          t<focus />wo
        </link>
      </paragraph>
    </document>
  </value>
)

// TODO: this output selection seems bad
export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />wo
        </link>
      </paragraph>
    </document>
  </value>
)
