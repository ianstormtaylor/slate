/** @jsx h */

import h from '../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph thing="value">one</paragraph>
    </document>
  </value>
)

export const output = ['slt1', 1, [2, 'paragraph', { thing: 'value' }, 'one']]
