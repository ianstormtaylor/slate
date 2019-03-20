/** @jsx h */

import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">one</text>
        <inline type="link" key="c">
          <text key="d">
            tw<cursor />o
          </text>
        </inline>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getLeafBlocksAtRangeAsArray(selection).map(n => n.key)
}

export const output = ['a']
