/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(

    <block>
      <inline>bar</inline>
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
          <inline>
          bar<cursor />
        </inline>
        baz
        </block>
    </block>

  </value>
)
