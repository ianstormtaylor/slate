/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <inline type="link">bar</inline>
      </block>
    
  )
}

export const input = (
  <value>
    
      <code>
        <block>
          Foo<cursor />baz
        </block>
      </code>
    
  </value>
)

export const output = (
  <value>
    
      <code>
        <block>
          Foo
          <inline type="link">
            bar<cursor />
          </inline>
          baz
        </block>
      </code>
    
  </value>
)
