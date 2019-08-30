/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitInline()
}

export const input = (
  <value>
    <document>
      <paragraph>
        <link>word</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)

// The cursor is normalized to the next text node, so splitInline has
// no effect.
export const output = (
  <value>
    <document>
      <paragraph>
        <link>word</link>
        <cursor />
      </paragraph>
    </document>
  </value>
)
