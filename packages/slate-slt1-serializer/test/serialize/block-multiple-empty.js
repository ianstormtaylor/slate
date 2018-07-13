/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>one</paragraph>
      <paragraph />
      <paragraph>three</paragraph>
    </document>
  </value>
)

export const output = [
  'slt1',
  1,
  [2, 'paragraph', 'one'],
  [2, 'paragraph'],
  [2, 'paragraph', 'three'],
]
