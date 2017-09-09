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
          <link>
            <hashtag>
              two
            </hashtag>
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
