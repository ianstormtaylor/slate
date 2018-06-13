/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.toggleMark('bold')
}

export const input = (
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

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />o<focus />rd
      </paragraph>
    </document>
  </value>
)
