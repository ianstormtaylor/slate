/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'
import { Editor } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        wo
        <mark type="a">
          <anchor />
          rd
        </mark>
      </paragraph>
      <paragraph>
        <paragraph>
          <mark type="b">
            <mark type="a">middle</mark>
          </mark>
        </paragraph>
        <paragraph />
      </paragraph>
      <paragraph>
        <mark type="b">
          <mark type="a">
            an
            <focus />
            other
          </mark>
        </mark>
        <mark type="c">unselected marked text</mark>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return editor.getActiveMarksAtRange(selection, document)
}

export const output = Set.of(Mark.create('a'))
