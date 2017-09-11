/** @jsx h */

import { h } from 'slate-test-helpers'

export const input = `
one
two
`.trim()

export const output = (
  <state>
    <document>
      <line>
        one
      </line>
      <line>
        two
      </line>
    </document>
  </state>
)
