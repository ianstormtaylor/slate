/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold').insertText('s')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          wo<cursor />rd
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>wo</b>
        s<cursor />
        <b>rd</b>
      </paragraph>
    </document>
  </value>
)
