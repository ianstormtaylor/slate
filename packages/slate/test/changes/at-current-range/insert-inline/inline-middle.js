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
        <link>wo<cursor />rd</link>
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        <link>wo<emoji><cursor />{' '}</emoji>rd</link>
      </paragraph>
    </document>
  </state>
)
