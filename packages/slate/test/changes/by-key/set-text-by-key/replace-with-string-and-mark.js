/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setTextByKey(change.value.selection.anchor.key, 'cat is cute', [
    { type: 'bold' },
    { type: 'italic' },
  ])
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
          <b>cat is cute</b>
        </i>
        <cursor />
      </paragraph>
    </document>
  </value>
)
