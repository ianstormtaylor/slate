/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.unwrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<anchor />
        <hashtag>
          or<focus />
        </hashtag>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<anchor />or<focus />d
      </paragraph>
    </document>
  </value>
)
