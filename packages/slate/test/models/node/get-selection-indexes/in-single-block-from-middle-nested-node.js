/** @jsx h */

import h from '../../../helpers/h'
import PathUtils from '../../../../src/utils/path-utils'

export const input = (
  <value>
    <document>
      <paragraph>
        before
        <anchor />start
        <inline type="inline_type" />
        <inline type="inline_with_text">inline text</inline>
        end<focus />
        after
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  const node = document.getDescendant(PathUtils.create([0, 2]))
  return node.getSelectionIndexes(selection, [0, 2])
}

export const output = { start: 0, end: 1 }
