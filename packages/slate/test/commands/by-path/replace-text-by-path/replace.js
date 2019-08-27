/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceTextByPath([0, 0], 3, 1, 'three')
}

export const input = (
  <value>
    <document>
      <paragraph>
        one<cursor />two
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        onethree<cursor />wo
      </paragraph>
    </document>
  </value>
)
