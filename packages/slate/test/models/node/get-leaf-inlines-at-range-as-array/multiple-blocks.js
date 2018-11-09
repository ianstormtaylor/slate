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
        <inline type="link" key="e">
          <text key="f">three</text>
        </inline>
      </paragraph>
      <image key="g" src="https://example.com/image2.png">
        <text key="h" />
      </image>
      <paragraph key="i">
        <inline type="link" key="j">
          <inline type="link-part" key="k">
            <text key="l">four</text>
          </inline>
          <inline type="link-part" key="m">
            <text key="n">five</text>
          </inline>
        </inline>
        <text key="o">
          <focus />six
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getLeafInlinesAtRangeAsArray(selection).map(n => n.key)
}

export const output = ['e', 'k', 'm']
