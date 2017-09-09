/** @jsx sugar */

import sugar from '../../../helpers/sugar'

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
