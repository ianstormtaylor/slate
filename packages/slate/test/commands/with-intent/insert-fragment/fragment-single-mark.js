/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <b>bar</b>
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
          <b>
            bar<cursor />
          </b>
          baz
        </block>
      </code>
    
  </value>
)
