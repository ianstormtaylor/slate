/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setInlines('emoji')
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
        <emoji>
          <cursor />word
        </emoji>
      </paragraph>
    </document>
  </value>
)
