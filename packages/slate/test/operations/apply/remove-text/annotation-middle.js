/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'remove_text',
    path: [0, 0],
    offset: 1,
    text: 'o',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        w<highlight>or</highlight>d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        w<highlight>r</highlight>d
      </paragraph>
    </document>
  </value>
)
