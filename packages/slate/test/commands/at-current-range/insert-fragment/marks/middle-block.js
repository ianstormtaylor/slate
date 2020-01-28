/** @jsx h */

import h from '../../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <b>bar</b>
      </paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <code>
        <paragraph>
          Foo
          <cursor />
          baz
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
          Foo
          <b>bar</b>
          <cursor />
          baz
        </paragraph>
      </code>
    </document>
  </value>
)
