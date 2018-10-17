/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceMark('italic', 'bold')
}

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />
        <i>rd</i>
      </paragraph>
      <paragraph>
        <i>an</i>
        <focus />other
      </paragraph>
    </document>
  </value>
)

export const output = (
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
