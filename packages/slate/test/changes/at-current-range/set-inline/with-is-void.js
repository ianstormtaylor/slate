/** @jsx h */

import { h } from 'slate-core-test-helpers'

export default function (change) {
  change.setInline({
    type: 'emoji',
    isVoid: true
  })
}

export const input = (
  <state>
    <document>
      <paragraph>
        <link><cursor />word</link>
      </paragraph>
    </document>
  </state>
)

// TODO: fix cursor placement
export const output = (
  <state>
    <document>
      <paragraph>
        <cursor /><emoji>{' '}</emoji>
      </paragraph>
    </document>
  </state>
)
