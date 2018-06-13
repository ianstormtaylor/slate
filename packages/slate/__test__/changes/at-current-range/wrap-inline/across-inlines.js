/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          wo<anchor />rd
        </link>
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
        <link>wo</link>
        <hashtag>
          <link>
            <anchor />rd
          </link>
          <link>an</link>
        </hashtag>
        <link>
          <focus />other
        </link>
      </paragraph>
    </document>
  </value>
)
