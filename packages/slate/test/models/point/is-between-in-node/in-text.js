/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          <anchor />Cat<focus /> is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { selection: { anchor, focus }, anchorText } = value
  return {
    anchor: anchor.isBetweenInNode(anchorText, 0, 0),
    focus: focus.isBetweenInNode(anchorText, 0, 0),
  }
}

export const output = {
  anchor: true,
  focus: false,
}
