/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.insertText(' ')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        {' '}
        <cursor />word
      </paragraph>
    </document>
  </value>
)
