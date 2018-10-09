/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setBlocks('image')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />word
      </image>
    </document>
  </value>
)
