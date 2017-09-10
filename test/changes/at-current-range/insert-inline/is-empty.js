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
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <emoji><cursor />{' '}</emoji>
      </paragraph>
    </document>
  </state>
)
