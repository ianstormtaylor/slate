/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">
          <focus />
          one
        </text>
      </paragraph>
      <quote key="c">
        <quote key="d">
          <paragraph key="e">
            <text key="f">two</text>
          </paragraph>
        </quote>
        <quote key="g">
          <paragraph key="h">
            <text key="i">three</text>
          </paragraph>
          <paragraph key="j">
            <text key="k">
              <anchor />
              four
            </text>
          </paragraph>
          <paragraph key="l">
            <text key="m">five</text>
          </paragraph>
        </quote>
      </quote>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getLeafBlocksAtRange(selection).map(n => n.key)
}

export const output = List(['a', 'e', 'h', 'j'])
