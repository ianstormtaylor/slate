/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { anchor } = change.value.selection
  change.replaceTextByKey(anchor.key, anchor.offset, 3, 'cat is cute')
}

export const input = (
  <value>
    <document>
      <paragraph>
        Meow, <cursor />word.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Meow, cat is cute<cursor />d.
      </paragraph>
    </document>
  </value>
)
