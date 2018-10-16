/** @jsx h */

import { Point, Range } from 'slate'

import h from '../../../helpers/h'

export default function(change) {
  const { key } = change.value.document.getFirstText()
  const range = new Range({
    anchor: new Point({ key, offset: 0 }),
    focus: new Point({ key, offset: 3 }),
  })
  change.insertTextAtRange(range, 'That')
}

export const input = (
  <value>
    <document>
      <line>The change will be here.</line>
      <line>
        The cursor is <cursor />over here.
      </line>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <line>That change will be here.</line>
      <line>
        The cursor is <cursor />over here.
      </line>
    </document>
  </value>
)
