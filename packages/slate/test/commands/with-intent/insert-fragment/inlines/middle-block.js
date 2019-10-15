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
          <inline>
            bar<cursor />
          </inline>
          baz
        </block>
      </code>
    
  </value>
)
