/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.setBlock({
    type: 'image',
    isVoid: true
  })
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
        <cursor />{' '}
      </image>
    </document>
  </value>
)
