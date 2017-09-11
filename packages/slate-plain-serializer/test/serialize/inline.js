/** @jsx h */

import { h } from 'slate-test-helpers'

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          one
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
one
`.trim()
