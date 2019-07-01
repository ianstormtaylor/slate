/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.splitDescendantsByKey('a', 'b', 0)
}

export const input = (
  <value>
    <document>
      <paragraph key="a">
        <emoji key="b" />
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
      </paragraph>
      <paragraph>
        <emoji />
      </paragraph>
    </document>
  </value>
)
