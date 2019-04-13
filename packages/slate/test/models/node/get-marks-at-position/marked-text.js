/** @jsx h */

import h from '../../../helpers/h'
import { Set } from 'immutable'
import { Mark } from 'slate'
import PathUtils from '../../../../src/utils/path-utils'

const path = PathUtils.create([0, 0])

export const input = (
  <value>
    <document>
      <paragraph>
        <text>
          <i>Cat </i>
          is
          <b> Cute</b>
        </text>
      </paragraph>
    </document>
  </value>
)

export default function({ document, selection }) {
  return document.getMarksAtPosition(path, 1)
}

export const output = Set.of(Mark.create('italic'))
