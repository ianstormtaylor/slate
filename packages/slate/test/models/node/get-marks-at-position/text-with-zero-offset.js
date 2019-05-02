/** @jsx h */

import h from '../../../helpers/h'
import { OrderedSet } from 'immutable'
import { Mark } from 'slate'
import PathUtils from '../../../../src/utils/path-utils'

const path = PathUtils.create([1, 1, 0])

export const input = (
  <value>
    <document>
      <paragraph>
        <text>Cat is Cute</text>
      </paragraph>
      <paragraph>
        <text>
          <b>Dog is</b>
        </text>
        <link>
          <text>Delightful</text>
        </link>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getMarksAtPosition(path, 0)
}

export const output = OrderedSet.of(Mark.create('bold'))
