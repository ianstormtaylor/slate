/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <quote key="a">
        <quote key="b">
          <paragraph key="c">
            <text key="d">one</text>
          </paragraph>
          <paragraph key="e">
            <text key="f">two</text>
          </paragraph>
        </quote>
        <quote key="g">
          <paragraph key="h">
            <text key="i">
              three
              <cursor />
            </text>
          </paragraph>
        </quote>
      </quote>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getRootBlocksAtRange(selection).map(n => n.key)
}

export const output = List(['a'])
