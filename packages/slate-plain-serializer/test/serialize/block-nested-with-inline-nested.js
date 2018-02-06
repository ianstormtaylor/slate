/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>
          <link>
            <hashtag>two</hashtag>
          </link>
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = `
one
two
`.trim()
