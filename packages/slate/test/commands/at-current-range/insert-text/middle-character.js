/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w<cursor />ord
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wa<cursor />ord
      </paragraph>
    </document>
  </value>
)
