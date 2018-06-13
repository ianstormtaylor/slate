/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
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
        w<hashtag>
          <anchor />or
        </hashtag>
        <focus />d
      </paragraph>
    </document>
  </value>
)
