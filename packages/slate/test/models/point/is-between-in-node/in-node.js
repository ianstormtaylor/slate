/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph>Cat</paragraph>
      <paragraph>
        <text>
          <anchor />Cat<focus /> is Cute
        </text>
      </paragraph>
    </document>
  </value>
)

export default function(value) {
  const { selection: { anchor, focus }, document } = value
  return {
    anchor: anchor.isBetweenInNode(document, 3, 4),
    focus: focus.isBetweenInNode(document, 0, 5),
  }
}

export const output = {
  anchor: true,
  focus: false,
}
