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

export const output = [
  'slt1',
  1,
  [
    2,
    'quote',
    [2, 'paragraph', 'one'],
    [2, 'paragraph', [3, 'link', [3, 'hashtag', 'two']]],
  ],
]
