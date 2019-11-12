/** @jsx jsx */

import { jsx } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(

    <block>
      <inline type="link">bar</inline>
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
          <inline type="link">
          bar<cursor />
        </inline>
        baz
        </block>
    </block>

  </value>
)
