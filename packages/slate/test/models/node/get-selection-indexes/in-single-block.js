/** @jsx h */

import h from '../../../helpers/h'

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
  return document.getSelectionIndexes(selection)
}

export const output = { start: 0, end: 1 }
