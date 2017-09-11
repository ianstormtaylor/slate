/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.setInline({
    type: 'hashtag',
    data: { thing: 'value' }
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

export const output = (
  <state>
    <document>
      <paragraph>
        <hashtag thing="value"><cursor />word</hashtag>
      </paragraph>
    </document>
  </state>
)
