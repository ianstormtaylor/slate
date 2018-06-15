/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 2,
    text: ' there',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        Hi<cursor /> there <highlight>you</highlight> person
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Hi<cursor /> <highlight>you</highlight> person
      </paragraph>
    </document>
  </value>
)
