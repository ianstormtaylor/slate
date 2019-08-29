/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.deleteForward()
}

export const input = (
  <value>
    <document>
      <paragraph>
        word
        <cursor />
      </paragraph>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </value>
)

// Normalization runs after positioning the cursor, so we need to
// manually add the text node inside the emoji void -- otherwise the
// cursor will move into the wrong node.
export const output = (
  <value>
    <document>
      <paragraph>
        word
        <cursor />
        <emoji>
          <text />
        </emoji>
      </paragraph>
    </document>
  </value>
)
