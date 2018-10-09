/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />o<hashtag>rd</hashtag>
      </paragraph>
      <paragraph>
        <hashtag>an</hashtag>ot<focus />her
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />ord
      </paragraph>
      <paragraph>
        anot<focus />her
      </paragraph>
    </document>
  </value>
)
