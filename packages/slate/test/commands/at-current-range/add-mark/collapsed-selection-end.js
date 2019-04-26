/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.addMark('bold').insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        word<cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        word<b>
          a<cursor />
        </b>
      </paragraph>
    </document>
  </value>
)
