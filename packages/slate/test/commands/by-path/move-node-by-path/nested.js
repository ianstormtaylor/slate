/** @jsx h */

import h from '../../../helpers/h'
import { PathUtils } from 'slate'

export default function(editor) {
  editor.moveNodeByPath(PathUtils.create([0, 0]), PathUtils.create([1, 0]))
}

export const input = (
  <value>
    <document>
      <quote>
        <paragraph>one</paragraph>
      </quote>
      <quote>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <quote />
      <quote>
        <paragraph>one</paragraph>
        <paragraph>two</paragraph>
      </quote>
    </document>
  </value>
)
