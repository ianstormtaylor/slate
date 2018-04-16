/** @jsx h */

import h from '../../../helpers/h'

export default [
  {
    type: 'insert_text',
    path: [0, 0],
    offset: 6,
    text: 'x',
    marks: [],
  },
  {
    type: 'insert_text',
    path: [1, 0],
    offset: 5,
    text: 'small ',
    marks: [],
  },
  {
    type: 'remove_text',
    path: [2, 0],
    offset: 10,
    text: 'ation',
    marks: [],
  },
]

export const input = (
  <value>
    <document>
      <paragraph>
        This <highlight atomic>decoration</highlight> should be invalid,{' '}
        <highlight atomic>this</highlight> one shouldn't.
      </paragraph>
      <paragraph>
        This <highlight atomic>decoration</highlight> will be fine.
      </paragraph>
      <paragraph>
        This <highlight>decoration</highlight> can be altered, since non-atomic.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        This dxecoration should be invalid, <highlight atomic>this</highlight>{' '}
        one shouldn't.
      </paragraph>
      <paragraph>
        This small <highlight atomic>decoration</highlight> will be fine.
      </paragraph>
      <paragraph>
        This <highlight>decor</highlight> can be altered, since non-atomic.
      </paragraph>
    </document>
  </value>
)
