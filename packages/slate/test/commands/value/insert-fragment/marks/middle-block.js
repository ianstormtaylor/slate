/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(

    <block>
      <mark key="a">bar</mark>
    </block>

  )
}

export const input = (
  <value>

    <block>
      <block>
        Foo<cursor />baz
        </block>
    </block>

  </value>
)

export const output = (
  <value>

    <block>
      <block>
        Foo
          <mark key="a">
          bar<cursor />
        </mark>
        baz
        </block>
    </block>

  </value>
)
