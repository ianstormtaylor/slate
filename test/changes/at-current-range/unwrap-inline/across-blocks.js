/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <state>
    <document>
      <paragraph>
        w<anchor />o<hashtag>rd</hashtag>
      </paragraph>
      <paragraph>
        <hashtag>an</hashtag>ot<focus />her
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        w<anchor />ord
      </paragraph>
      <paragraph>
        anot<focus />her
      </paragraph>
    </document>
  </state>
)
