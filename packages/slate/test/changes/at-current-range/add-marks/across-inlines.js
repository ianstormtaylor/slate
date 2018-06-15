/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['bold', 'italic'])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />rd
        </link>
      </paragraph>
      <paragraph>
        <link>
          an<focus />other
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />
          <i>
            <b>rd</b>
          </i>
        </link>
        <i>
          <b />
        </i>
      </paragraph>
      <paragraph>
        <i>
          <b />
        </i>
        <link>
          <i>
            <b>an</b>
          </i>
          <focus />other
        </link>
      </paragraph>
    </document>
  </value>
)
