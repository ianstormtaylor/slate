/** @jsx h */

import h from '../../../helpers/h'

export default function(editor) {
  editor.insertFragment(
    <document>
      <paragraph>
        <inline type="link">bar</inline>
      </paragraph>
    </document>
  )
}

export const input = (
  <value>
    <document>
      <code>
        <paragraph>
          Foo<cursor />baz
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
          <inline type="link">
            bar<cursor />
          </inline>
          baz
        </paragraph>
      </code>
    </document>
  </value>
)
