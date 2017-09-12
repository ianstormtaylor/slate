/** @jsx h */

import h from '../helpers/h'

export const input = (
  <state>
    <document>
      <paragraph>
        one
      </paragraph>
      <paragraph />
      <paragraph>
        three
      </paragraph>
    </document>
  </state>
)

export const output = `
one

three
`.trim()
