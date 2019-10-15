/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <block>
        <b>b</b>
        <u>u</u>
        <i>i</i>
      </block>
    
  )
}

export const input = (
  <value>
    
      <block>
        wo<cursor />rd
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        wo
        <b>b</b>
        <u>u</u>
        <i>
          i<cursor />
        </i>
        rd
      </block>
    
  </value>
)
