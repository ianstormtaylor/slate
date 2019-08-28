/** @jsx h */

import { List } from 'immutable'
import h from '../../../helpers/h'

export const input = (
  <value>
    <document>
      <image key="a" src="https://example.com/image2.png">
        <text key="b" />
      </image>
    </document>
    <selection isFocused={false}>
      <anchor key="b" path={[0, 0]} offset={0} />
      <focus key="b" path={[0, 0]} offset={0} />
    </selection>
  </value>
)

export default function({ document, selection }) {
  return document.getLeafBlocksAtRange(selection).map(n => n.key)
}

export const output = List(['a'])
