/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        wor<anchor />d<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wor<anchor />
        <i>
          <b>d</b>
        </i>
        <focus />
      </paragraph>
    </document>
  </value>
)
