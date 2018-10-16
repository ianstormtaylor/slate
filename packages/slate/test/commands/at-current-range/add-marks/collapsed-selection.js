/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.addMarks(['bold', 'italic']).insertText('a')
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
        <i>
          <b>a</b>
        </i>
        <cursor />word
      </paragraph>
    </document>
  </value>
)
