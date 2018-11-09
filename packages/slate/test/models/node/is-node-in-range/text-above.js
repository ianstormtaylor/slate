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
          tw<anchor />o
        </text>
      </paragraph>
      <image key="e" src="https://example.com/image2.png">
        <text key="f" />
      </image>
      <paragraph key="g">
        <inline type="link" key="h">
          <text key="i">three</text>
        </inline>
        <text key="j">
          <focus />four
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.isNodeInRange([0, 0], selection)
}

export const output = false
