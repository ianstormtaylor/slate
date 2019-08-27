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
          <mark type="a">middle</mark>
        </paragraph>
        <paragraph />
      </paragraph>
      <paragraph>
        <mark type="a">
          an
          <focus />
          other
        </mark>
        <mark type="b">unselected marked text</mark>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const editor = new Editor({ value })
  const { document, selection } = value
  return document.getActiveMarksAtRange(selection, editor)
}

export const output = Set.of(Mark.create('a'))
