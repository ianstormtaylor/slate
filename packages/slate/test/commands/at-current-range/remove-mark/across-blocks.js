/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.removeMark('bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />
        <b>rd</b>
      </paragraph>
      <paragraph>
        <b>an</b>
        <focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wo<anchor />rd
      </paragraph>
      <paragraph>
        an<focus />other
      </paragraph>
    </document>
  </value>
)
