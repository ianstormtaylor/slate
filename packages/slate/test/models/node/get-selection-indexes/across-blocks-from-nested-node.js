/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'

export const input = (
  <value>
    <document>
      <paragraph>
        wo<anchor />
        <mark type="a">rd</mark>
      </paragraph>
      <paragraph>
        <paragraph>
          <mark type="b">middle</mark>
        </paragraph>
        <paragraph />
      </paragraph>
      <paragraph>unmarked</paragraph>
      <paragraph>
        <mark type="c">
          an<focus />other
        </mark>
        <mark type="d">unselected marked text</mark>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  const node = document.getDescendant(PathUtils.create([1]))
  return node.getSelectionIndexes(selection, [1])
}

export const output = { start: 0, end: 2 }
