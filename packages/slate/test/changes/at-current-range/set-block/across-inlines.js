/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setBlocks({ type: 'code' })
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
      <code>
        <link>
          <anchor />word
        </link>
      </code>
      <code>
        <link>
          <focus />another
        </link>
      </code>
    </document>
  </value>
)
