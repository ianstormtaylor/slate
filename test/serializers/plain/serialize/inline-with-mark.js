/** @jsx sugar */

import sugar from '../../../helpers/sugar'

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
