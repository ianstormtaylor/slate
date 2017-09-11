/** @jsx h */

import { h } from 'slate-test-helpers'

export const input = (
  <state>
    <document>
      <paragraph>
        on<b>e</b>
      </paragraph>
    </document>
  </state>
)

export const output = `
one
`.trim()
