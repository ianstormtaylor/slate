/** @jsx h */

import { h } from '../../../helpers'

export const run = editor => {
  editor.insertFragment(
    
      <list>
        <item>
          <block>2</block>
        </item>
        <item>
          <block>3</block>
        </item>
      </list>
    
  )
}

export const input = (
  <value>
    
      <list>
        <item>
          <block>
            1<cursor />
          </block>
        </item>
      </list>
    
  </value>
)

export const output = (
  <value>
    
      <list>
        <item>
          <block>12</block>
        </item>
        <item>
          <block>
            3<cursor />
          </block>
        </item>
      </list>
    
  </value>
)

export const skip = true
