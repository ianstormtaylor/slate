/** @jsx h */

import { Point, Range } from 'slate'

import { h } from '../../../helpers'

export const run = editor => {
  const { value: { document } } = editor
  const [firstText, firstPath] = document.firstText()
  const point = Point.create({ key: firstText.key, offset: 2, path: firstPath })
  const range = Range.create({ anchor: point, focus: point })
  editor.deleteBackwardAtRange(range, 2)
}

export const input = (
  <value>
    
      <block>
        <block>
          one<cursor />two
        </block>
      </block>
    
  </value>
)

export const output = (
  <value>
    
      <block>
        <block>
          e<cursor />two
        </block>
      </block>
    
  </value>
)
