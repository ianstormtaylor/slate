/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  change.setTextByKey(change.value.selection.anchor.key, 'cat is cute')
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
        cat is cute<cursor />
      </paragraph>
    </document>
  </value>
)
