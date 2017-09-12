/** @jsx h */

import h from '../helpers/h'

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
