/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          <link>
            one
          </link>
        </paragraph>
        <paragraph>
          <link>
            two
          </link>
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = `
one
two
`.trim()
