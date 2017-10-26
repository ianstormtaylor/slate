/** @jsx h */

import h from '../../helpers/h'

export const schema = {
  blocks: {
    paragraph: {
      marks: ['bold'],
    }
  }
}

export const input = (
  <state>
    <document>
      <paragraph>
        one <i>two</i> three
      </paragraph>
    </document>
  </state>
)

export const output = (
  <state>
    <document>
      <paragraph>
        one two three
      </paragraph>
    </document>
  </state>
)
