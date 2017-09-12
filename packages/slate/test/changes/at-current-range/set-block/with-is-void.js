/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({
    type: 'image',
    isVoid: true
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <cursor />word
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
    </document>
  </state>
)
