/** @jsx h */

import h from '../../../helpers/h'

export default function(change) {
  const { anchorKey, anchorOffset } = change.value
  change.replaceTextByKey(anchorKey, anchorOffset, 3, 'cat is cute')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>Meow, </b>
        <cursor />word.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>Meow, </b>
        cat is cute<cursor />d.
      </paragraph>
    </document>
  </value>
)
