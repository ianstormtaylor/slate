/** @jsx h */

import h from '../../../helpers/h'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        on
        <anchor />e
      </paragraph>
      <paragraph>two</paragraph>
      <paragraph>
        th
        <focus /> ree
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
    <paragraph>e</paragraph>
    <paragraph>two</paragraph>
    <paragraph>th</paragraph>
  </document>
)
