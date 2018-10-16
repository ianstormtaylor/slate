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
          hel<anchor />lo<focus />
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
          hel<hashtag>
            <anchor />lo<focus />
          </hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)
