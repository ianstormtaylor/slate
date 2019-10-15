/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <code>
        <block>
          <block>2</block>
          <block>3</block>
        </block>
      </code>
    
  )
}

export const input = (
  <value>
    
      <block>
        <code>
          <block>
            <block>
              1<cursor />
            </block>
          </block>
        </code>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <code>
          <block>
            <block>12</block>
            <block>
              3<cursor />
            </block>
          </block>
        </code>
      </block>
    
  </value>
)

export const skip = true
