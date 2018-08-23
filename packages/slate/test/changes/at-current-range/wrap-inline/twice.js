/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('link').wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />or<focus />d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<link />
        <hashtag>
          <link>
            <anchor />or
          </link>
        </hashtag>
        <focus />d
      </paragraph>
    </document>
  </value>
)
