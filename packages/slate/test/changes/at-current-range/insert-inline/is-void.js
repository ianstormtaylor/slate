/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertInline({
    type: 'emoji',
    isVoid: true
  })
}

export const input = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </value>
)
