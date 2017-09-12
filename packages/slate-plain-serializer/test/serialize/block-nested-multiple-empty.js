/** @jsx h */

import h from '../helpers/h'

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
