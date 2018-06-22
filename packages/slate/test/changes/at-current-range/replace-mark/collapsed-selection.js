/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.replaceMark('italic', 'bold').insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <i />
        <cursor />word
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>a</b>
        <cursor />word
      </paragraph>
    </document>
  </value>
)
