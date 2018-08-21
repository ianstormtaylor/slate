/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.splitBlock()
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
        <hashtag>
          an<focus />other
        </hashtag>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <link>wo</link>
      </paragraph>
      <paragraph>
        <link />
        <hashtag>
          <cursor />other
        </hashtag>
      </paragraph>
    </document>
  </value>
)
