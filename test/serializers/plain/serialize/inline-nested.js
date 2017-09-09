/** @jsx sugar */

import sugar from '../../../helpers/sugar'

export const input = (
  <state>
    <document>
      <paragraph>
        <link>
          <hashtag>
            one
          </hashtag>
        </link>
      </paragraph>
    </document>
  </state>
)

export const output = `
one
`.trim()
