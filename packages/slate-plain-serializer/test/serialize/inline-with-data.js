/** @jsx h */

import { h } from 'slate-core-test-helpers'

export const input = (
  <state>
    <document>
      <paragraph>
        <link thing="value">
          one
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
one
`.trim()
