/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['bold', 'underline'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <i>
          wo<focus />rd
        </i>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <anchor />
        <u>
          <b>
            <i>wo</i>
          </b>
        </u>
        <focus />
        <i>rd</i>
      </paragraph>
    </document>
  </value>
)
