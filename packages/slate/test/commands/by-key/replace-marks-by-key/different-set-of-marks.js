/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.replaceMarksByKey('a', 0, 2, [{ type: 'italic' }])
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b key="a" thing="value">
          word
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <i>wo</i>
        <b thing="value">rd</b>
      </paragraph>
    </document>
  </value>
)
