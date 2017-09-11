/** @jsx h */

import h from '../../../helpers/h'

function insertImageBlock(change, blockType) {
  change.insertBlock({
    type: 'image',
    isVoid: true,
  })
}

export default function (change) {
  change.call(insertImageBlock)
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        <cursor />{' '}
      </image>
      <paragraph>
        one
      </paragraph>
      <paragraph>
        two
      </paragraph>
    </document>
  </state>
)
