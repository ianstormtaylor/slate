/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>
          <link>one</link>
        </paragraph>
        <paragraph>
          <link>two</link>
        </paragraph>
      </quote>
    </document>
  </value>
)

export const output = [
  'slt1',
  1,
  [
    2,
    'quote',
    [2, 'paragraph', [3, 'link', 'one']],
    [2, 'paragraph', [3, 'link', 'two']],
  ],
]
