/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setNodeByKey('a', 'emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link key="a">
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
        <emoji>
          <cursor />word
        </emoji>
      </paragraph>
    </document>
  </value>
)
