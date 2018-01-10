/** @jsx h */

import h from '../../../helpers/h'

export default [{
  type: 'remove_text',
  path: [0, 0],
  offset: 2,
  text: 'is is some text inside ',
  marks: []
}]

export const input = (
  <value>
    <document>
      <paragraph>
        This <cursor />is some text inside a paragraph.
      </paragraph>
    </document>
  </value>
)

export const output = (
  <value>
    <document>
      <paragraph>
        Th<cursor />a paragraph.
      </paragraph>
    </document>
  </value>
)
