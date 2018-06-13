/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.delete()
}

export const input = (
  <value>
    <document>
      <paragraph>
        o<anchor />ne<link>two</link>thre<focus />e
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        o<cursor />e
      </paragraph>
    </document>
  </value>
)
