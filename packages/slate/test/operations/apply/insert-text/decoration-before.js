/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'insert_text',
    path: [0, 0],
    offset: 1,
    text: 'x',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />
        <highlight>or</highlight>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wx<cursor />
        <highlight>or</highlight>d
      </paragraph>
    </document>
  </value>
)
