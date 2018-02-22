/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setBlocks({ type: 'code' })
}

export const input = (
  <value>
    <document>
      <paragraph>
        <anchor />word
      </paragraph>
      <paragraph>
        a<focus />nother
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <code>
        <anchor />word
      </code>
      <code>
        a<focus />nother
      </code>
    </document>
  </value>
)
