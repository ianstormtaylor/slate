/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.toggleMark('bold').insertText('s')
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
        word<b>s</b>
        <cursor />
      </paragraph>
    </document>
  </value>
)
