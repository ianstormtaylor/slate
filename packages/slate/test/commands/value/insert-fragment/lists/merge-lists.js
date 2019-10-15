/** @jsx h */

import h from '../../../../helpers/h'

export const run = editor => {
  editor.insertFragment(
    
      <list>
        <item>3</item>
        <item>4</item>
      </list>
    
  )
}

export const input = (
  <value>
    
      <list>
        <item>1</item>
        <item>
          2<cursor />
        </item>
      </list>
    
  </value>
)

export const output = (
  <value>
    
      <list>
        <item>1</item>
        <item>23</item>
        <item>
          4<cursor />
        </item>
      </list>
    
  </value>
)

export const skip = true
