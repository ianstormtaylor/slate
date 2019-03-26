/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />
        <mark type="a">rd</mark>
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
            an<focus />other
          </mark>
        </mark>
        <mark type="c">unselected marked text</mark>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getActiveMarksAtRange(selection)
}

export const output = Set.of(Mark.create('a'))
