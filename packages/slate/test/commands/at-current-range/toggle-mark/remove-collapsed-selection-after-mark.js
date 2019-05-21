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
          word<cursor />
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <b>word</b>s<cursor />
      </paragraph>
    </document>
  </value>
)
