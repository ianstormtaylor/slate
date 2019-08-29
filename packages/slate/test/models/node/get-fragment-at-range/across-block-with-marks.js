/** @jsx h */

import h from '../../../helpers/h'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        wo
        <b>
          <anchor />
          rd
        </b>
      </paragraph>
      <paragraph>
        <b>middle</b>
      </paragraph>
      <paragraph>
        <b>
          an
          <focus />
          other
        </b>
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
    <paragraph>
      <b>rd</b>
    </paragraph>
    <paragraph>
      <b>middle</b>
    </paragraph>
    <paragraph>
      <b>an</b>
    </paragraph>
  </document>
)
