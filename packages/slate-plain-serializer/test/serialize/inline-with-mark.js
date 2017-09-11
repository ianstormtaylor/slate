/** @jsx h */

import { h } from 'slate-core-test-helpers'

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          on<b>e</b>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
one
`.trim()
