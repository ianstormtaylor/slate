/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.toggleMark('bold')
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
          <b>rd</b>
        </link>
        <mark type="bold" />
      </paragraph>
      <paragraph>
        <mark type="bold" />
        <link>
          <b>an</b>
          <focus />other
        </link>
      </paragraph>
    </document>
  </value>
)
