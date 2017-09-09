/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const input = (
  <state>
    <document>
      <quote>
        <quote>
          <paragraph>
            one
          </paragraph>
          <paragraph>
            two
          </paragraph>
        </quote>
        <quote>
          <paragraph>
            three
          </paragraph>
          <paragraph>
            four
          </paragraph>
        </quote>
      </quote>
    </document>
  </state>
)

export const output = `
one
two
three
four
`.trim()
