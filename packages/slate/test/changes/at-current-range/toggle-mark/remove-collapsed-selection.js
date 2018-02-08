/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change
    .toggleMark('bold')
    .toggleMark('bold')
    .insertText('s')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        words<cursor />
      </paragraph>
    </document>
  </value>
)
