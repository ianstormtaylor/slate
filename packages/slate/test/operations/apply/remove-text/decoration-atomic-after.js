/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 1,
    text: 'or',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        wor<highlight atomic>d</highlight>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<highlight atomic>d</highlight>
      </paragraph>
    </document>
  </value>
)
