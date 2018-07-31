/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />
        <i>o</i>
        <focus />rd
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />
        <b>o</b>
        <focus />rd
      </paragraph>
    </document>
  </value>
)
