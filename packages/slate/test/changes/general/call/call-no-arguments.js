/** @jsx h */

import h from '../../../helpers/h'

function insertImageBlock(change, blockType) {
  change.insertBlock('image')
}

export default function(change) {
  change.call(insertImageBlock)
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
