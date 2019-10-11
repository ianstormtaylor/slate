/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <code>
        <paragraph>2</paragraph>
      </code>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <code>
        <paragraph>
          {'1 '}
          <cursor />
        </paragraph>
      </code>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <code>
        <paragraph>
          1 2<cursor />
        </paragraph>
      </code>
    </document>
  </value>
)

export const skip = true
