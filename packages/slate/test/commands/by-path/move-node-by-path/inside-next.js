/** @jsx h */

import h from '../../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.moveNodeByPath(PathUtils.create([0]), PathUtils.create([1, 1]))
}

export const input = (
  <value>
    <document>
      <paragraph>
        <cursor />one
      </paragraph>
      <quote>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote>
        <paragraph>two</paragraph>
        <paragraph>
          <cursor />one
        </paragraph>
      </quote>
    </document>
  </value>
)
