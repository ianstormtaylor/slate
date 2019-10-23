/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>fragment</block>
    
  )
}

export const input = (
  <value>
    
      <block>
        <inline>
          wo<cursor />rd
        </inline>
      </block>
    
  </value>
)

// TODO: argument to made that fragment should go into the inline
export const output = (
  <value>
    
      <block>
        <inline>wo</inline>
        fragment<cursor />
        <inline>rd</inline>
      </block>
    
  </value>
)
