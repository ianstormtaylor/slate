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
