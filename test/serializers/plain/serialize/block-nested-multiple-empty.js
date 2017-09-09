/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const input = (
  <state>
    <document>
      <quote>
        <paragraph>
          one
        </paragraph>
        <paragraph>
          two
        </paragraph>
      </quote>
      <quote>
        <paragraph />
        <paragraph>
          four
        </paragraph>
      </quote>
    </document>
  </state>
)

export const output = `
one
two

four
`.trim()
