/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />w<focus />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <i>
          <b>w</b>
        </i>
        <focus />ord
      </paragraph>
    </document>
  </value>
)
