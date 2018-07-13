/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
      <quote>
        <paragraph>three</paragraph>
        <paragraph>four</paragraph>
      </quote>
    </document>
  </value>
)

export const output = [
  'slt1',
  1,
  [2, 'quote', [2, 'paragraph', 'one'], [2, 'paragraph', 'two']],
  [2, 'quote', [2, 'paragraph', 'three'], [2, 'paragraph', 'four']],
]
