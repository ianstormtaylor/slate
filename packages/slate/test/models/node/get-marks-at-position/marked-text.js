/** @jsx h */

import h from '../../../helpers/h'
import { OrderedSet } from 'immutable'
import { Mark } from 'slate'
import PathUtils from '../../../../src/utils/path-utils'

const path = PathUtils.create([0, 0])

export const input = (
  <value>
    <document>
      <paragraph>
        <i>Cat </i>
        is
        <b> Cute</b>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getMarksAtPosition(path, 1)
}

export const output = OrderedSet.of(Mark.create('italic'))
