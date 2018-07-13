/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <link thing="value">one</link>
      </paragraph>
    </document>
  </value>
)

export const output = [
  'slt1',
  1,
  [2, 'paragraph', [3, 'link', { thing: 'value' }, 'one']],
]
