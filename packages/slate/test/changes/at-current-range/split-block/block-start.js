/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
}

export const input = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph>
        <cursor />another
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>word</paragraph>
      <paragraph />
      <paragraph>
        <cursor />another
      </paragraph>
    </document>
  </value>
)
