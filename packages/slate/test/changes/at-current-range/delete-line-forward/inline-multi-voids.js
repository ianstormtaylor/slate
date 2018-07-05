/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.deleteLineForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
        one
        <emoji>😊</emoji>
        two
        <emoji>😊</emoji>
        three
        <emoji>😀</emoji>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)
