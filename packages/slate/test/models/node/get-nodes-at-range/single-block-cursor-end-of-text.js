/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">one</text>
      </paragraph>
      <paragraph key="c">
        <text key="d">
          two
          <cursor />
        </text>
      </paragraph>
      <paragraph key="e">
        <text key="f">three</text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document
    .getNodesAtRange(selection)
    .map(n => n.key)
    .toArray()
}

export const output = ['c', 'd']
