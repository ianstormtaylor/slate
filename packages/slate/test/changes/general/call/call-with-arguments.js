/** @jsx h */

import h from '../../../helpers/h'

function insertBlockByType(change, blockType) {
  change.insertBlock({ type: blockType })
}

export default function(change) {
  change.call(insertBlockByType, 'image')
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
