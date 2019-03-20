/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertInline('emoji')
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        <emoji>
          <cursor />
        </emoji>
      </paragraph>
    </document>
  </value>
)
