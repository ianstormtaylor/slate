/** @jsx h */

import h from '../../../helpers/h'

export default function (change) {
  change.insertInline({
    type: 'emoji',
    isVoid: true
  })
}

export const input = (
  <state>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <image>
        <cursor />
      </image>
    </document>
  </state>
)
