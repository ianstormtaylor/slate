/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setInlines({ type: 'hashtag' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <anchor />word
        </link>
      </paragraph>
      <paragraph>
        <link>
          <focus />another
        </link>
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
      </paragraph>
      <paragraph>
        <hashtag>
          <focus />another
        </hashtag>
      </paragraph>
    </document>
  </value>
)
