/** @jsx h */

import { h } from 'slate-test-helpers'

export default function (change) {
  change.setInline('hashtag')
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
        <hashtag><cursor />word</hashtag>
      </paragraph>
    </document>
  </state>
)
