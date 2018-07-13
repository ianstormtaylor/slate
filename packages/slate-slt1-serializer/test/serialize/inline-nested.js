/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <link>
          <hashtag>one</hashtag>
        </link>
      </paragraph>
    </document>
  </value>
)

export const output = [
  'slt1',
  1,
  [2, 'paragraph', [3, 'link', [3, 'hashtag', 'one']]],
]
