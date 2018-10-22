/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteWordForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
      <paragraph>another</paragraph>
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
