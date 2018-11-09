/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <inline type="i1" key="b">
          <inline type="i2" key="c">
            <inline type="i3" key="d">
              <text key="e">
                o<anchor />ne
              </text>
            </inline>
          </inline>
          <inline type="i2" key="f">
            <inline type="i3" key="g">
              <text key="h">two</text>
            </inline>
            <text key="i">three</text>
          </inline>
          <text key="j">
            four<focus />
          </text>
        </inline>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getRootInlinesAtRange(selection).map(n => n.key)
}

export const output = List(['b'])
