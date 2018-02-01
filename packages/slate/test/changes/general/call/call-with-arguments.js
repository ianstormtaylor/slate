/** @jsx h */

import h from '../../../helpers/h'

function insertVoid(change, blockType) {
  change.insertBlock({
    type: blockType,
    isVoid: true,
  })
}

export default function(change) {
  change.call(insertVoid, 'image')
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
        {' '}
        <cursor />
      </image>
      <paragraph>one</paragraph>
      <paragraph>two</paragraph>
    </document>
  </value>
)
