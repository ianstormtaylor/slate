/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor<anchor />
        <i>d</i>
        <focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wor<anchor />
        <b>d</b>
        <focus />
      </paragraph>
    </document>
  </value>
)
