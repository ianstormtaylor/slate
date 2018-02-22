/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setInlines('hashtag')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <cursor />word
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
          <cursor />word
        </hashtag>
      </paragraph>
    </document>
  </value>
)
