/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.toggleMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />a<b>word</b>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <b>aword</b>
        <focus />
      </paragraph>
    </document>
  </value>
)
