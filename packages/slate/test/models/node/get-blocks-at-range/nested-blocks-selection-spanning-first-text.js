/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote key="a">
        <quote key="b">
          <paragraph key="c">
            <text key="d">
              <anchor />one<focus />
            </text>
          </paragraph>
        </quote>
      </quote>
      <paragraph key="e">
        <text key="f">two</text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getBlocksAtRange(selection).map(n => n.key)
}

export const output = List(['a', 'b', 'c'])
