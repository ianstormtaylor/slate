/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline('hashtag')
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          w<anchor />or<focus />d
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>
          w<hashtag>
            <anchor />or
          </hashtag>
          <focus />d
        </paragraph>
      </quote>
    </document>
  </value>
)
