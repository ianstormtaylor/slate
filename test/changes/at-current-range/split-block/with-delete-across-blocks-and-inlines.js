/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.splitBlock()
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link>wo<anchor />rd</link>
      </paragraph>
      <paragraph>
        <hashtag>an<focus />other</hashtag>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo</link>
      </paragraph>
      <paragraph>
        <hashtag><cursor />other</hashtag>
      </paragraph>
    </document>
  </state>
)
