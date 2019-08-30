/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertText('a')
}

export const input = (
  <value>
    <document>
      <paragraph>
        w
        <b>
          <cursor />
          or
        </b>
        d
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        wa
        <b>
          <cursor />
          or
        </b>
        d
      </paragraph>
    </document>
  </value>
)
