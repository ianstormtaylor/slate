/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.moveWordBackward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one tw<cursor />o three
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one <cursor />two three
      </paragraph>
    </document>
  </value>
)
