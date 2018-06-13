/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.wrapInline({
    type: 'hashtag',
    data: { thing: 'value' },
  })
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
        w<hashtag thing="value">
          <anchor />or
        </hashtag>
        <focus />d
      </paragraph>
    </document>
  </value>
)
