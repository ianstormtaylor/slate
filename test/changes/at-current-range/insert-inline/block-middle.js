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
      <paragraph>wo<cursor />rd</paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        wo<emoji><cursor />{' '}</emoji>rd
      </paragraph>
    </document>
  </state>
)
