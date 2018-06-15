/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'insert_text',
    path: [0, 0],
    offset: 2,
    text: ' added',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        Hi<cursor /> there <highlight>you</highlight>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Hi added<cursor /> there <highlight>you</highlight>
      </paragraph>
    </document>
  </value>
)
