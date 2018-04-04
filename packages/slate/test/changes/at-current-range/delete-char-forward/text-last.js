/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteCharForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor<cursor />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wor<cursor />
      </paragraph>
    </document>
  </value>
)
