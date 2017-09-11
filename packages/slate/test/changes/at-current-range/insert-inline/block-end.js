/** @jsx h */

import { h } from 'slate-test-helpers'

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
        word<cursor />
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        word<emoji><cursor />{' '}</emoji>
      </paragraph>
    </document>
  </state>
)
