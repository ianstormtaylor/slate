/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <text key="b">one</text>
      </paragraph>
      <paragraph key="c">
        <text key="d">
          <cursor />
          two
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getRootBlocksAtRange(selection).map(n => n.key)
}

export const output = List(['c'])
