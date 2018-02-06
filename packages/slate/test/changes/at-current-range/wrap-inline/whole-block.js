/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word<focus />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <hashtag>
          <anchor />word
        </hashtag>
        <focus />
      </paragraph>
    </document>
  </value>
)
