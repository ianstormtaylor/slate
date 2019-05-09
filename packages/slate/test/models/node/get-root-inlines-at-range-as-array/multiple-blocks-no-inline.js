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
        <text key="h">
          <focus />four
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getRootInlinesAtRangeAsArray(selection).map(n => n.key)
}

export const output = []
