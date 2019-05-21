/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.toggleMark('bold').insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <b>
          <cursor />word
        </b>
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        a<b>
          <cursor />word
        </b>
      </paragraph>
    </document>
  </value>
)
