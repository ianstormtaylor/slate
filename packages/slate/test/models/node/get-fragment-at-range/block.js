/** @jsx h */

import h from '../../../helpers/h'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        one <anchor />
        two
        <focus /> three
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return editor.getFragmentAtRange(selection, document)
}

export const output = (
  <document>
    <paragraph>two</paragraph>
  </document>
)
