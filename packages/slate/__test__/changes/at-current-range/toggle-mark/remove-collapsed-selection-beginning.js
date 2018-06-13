/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change
    .toggleMark('bold')
    .toggleMark('bold')
    .insertText('a')
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
        a<cursor />word
      </paragraph>
    </document>
  </value>
)
