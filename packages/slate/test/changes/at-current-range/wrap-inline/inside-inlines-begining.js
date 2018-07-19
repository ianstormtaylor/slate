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
          <anchor />hel<focus />lo
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
          <hashtag>
            <anchor />hel<focus />
          </hashtag>lo
        </link>
      </paragraph>
    </document>
  </value>
)
