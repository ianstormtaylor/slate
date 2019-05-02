/** @jsx h */

import h from '../../../helpers/h'
import { OrderedSet } from 'immutable'
import PathUtils from '../../../../src/utils/path-utils'

const path = PathUtils.create([0, 0])

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          <b>Cat is Cute</b>
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getMarksAtPosition(path, 0)
}

export const output = OrderedSet.of()
