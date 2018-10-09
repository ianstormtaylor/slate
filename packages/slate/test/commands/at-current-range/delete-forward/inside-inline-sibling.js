/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<link>
          <cursor />a
        </link>two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        one<link>
          <cursor />
        </link>two
      </paragraph>
    </document>
  </value>
)
